import { Router } from "express";
import { Pool } from "pg";

const router = Router();

// Configure Postgres pool from env or defaults (docker-compose values)
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Elitefinder2025",
  database: process.env.DB_NAME || "postgres",
});

// List conversations with basic fields from mensagem + atendimento
router.get("/conversations", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const { rows } = await pool.query(
      `SELECT m.id_mensagem as id,
              COALESCE(a.nome_atendente,'N/A') as attendant,
              a.empresa as empresa,
              COALESCE(a.pontuacao_geral, 0) as score,
              a.sentimento_geral as sentiment,
              a.tipo_atendimento as type,
              m.conteudo_texto as message,
              to_char(m.data_hora, 'YYYY-MM-DD') as timestamp
       FROM public.mensagem m
       LEFT JOIN public.atendimento a ON a.id_atendimento = m.id_atendimento
       ORDER BY m.data_hora DESC
       LIMIT $1`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    console.error("analytics/conversations error", err);
    res.status(500).json({ error: "failed_to_fetch_conversations" });
  }
});

// Export CSV of AI analysis from analisequalidade table
router.get("/export.csv", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id_analise,
              saudacao_inicial,
              uso_nome_cliente,
              rapport_empatia,
              uso_emojis,
              tom_conversa,
              erros_gramaticais,
              resolutividade,
              tempo_resposta,
              indicios_venda,
              sentimento_geral,
              tipo_atendimento,
              pontuacao_geral,
              observacoes,
              to_char(data_hora, 'YYYY-MM-DD HH24:MI:SS') as data_hora
       FROM public.analisequalidade
       ORDER BY data_hora DESC`
    );

    // Build CSV
    const headers = Object.keys(rows[0] || {});
    const escape = (v: any) => {
      if (v == null) return "";
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    };
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => escape((r as any)[h])).join(","))].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=analise_ia.csv");
    res.send(csv);
  } catch (err) {
    console.error("analytics/export.csv error", err);
    res.status(500).json({ error: "failed_to_export_csv" });
  }
});

export default router;
