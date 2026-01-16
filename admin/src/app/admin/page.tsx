'use client';

import { useEffect, useState } from 'react';
import { Users, FileCheck, XCircle, CheckCircle, DollarSign, AlertCircle } from 'lucide-react';
import styles from './dashboard.module.css';

interface Stats {
  totalInstructors: number;
  approved: number;
  pending: number;
  rejected: number;
  mrr: number;
  pastDue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Mock data por enquanto - substituir por API real
      setStats({
        totalInstructors: 5,
        approved: 2,
        pending: 1,
        rejected: 1,
        mrr: 149400, // R$ 1.494,00
        pastDue: 0,
      });
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard Administrativo</h1>
        <p>Visão geral do sistema</p>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: '#667eea' }}>
            <Users size={24} />
          </div>
          <div className={styles.kpiContent}>
            <p className={styles.kpiLabel}>Total de Instrutores</p>
            <p className={styles.kpiValue}>{stats?.totalInstructors || 0}</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: '#48bb78' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.kpiContent}>
            <p className={styles.kpiLabel}>Aprovados</p>
            <p className={styles.kpiValue}>{stats?.approved || 0}</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: '#ed8936' }}>
            <FileCheck size={24} />
          </div>
          <div className={styles.kpiContent}>
            <p className={styles.kpiLabel}>Pendentes de Análise</p>
            <p className={styles.kpiValue}>{stats?.pending || 0}</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: '#f56565' }}>
            <XCircle size={24} />
          </div>
          <div className={styles.kpiContent}>
            <p className={styles.kpiLabel}>Reprovados</p>
            <p className={styles.kpiValue}>{stats?.rejected || 0}</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: '#38b2ac' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.kpiContent}>
            <p className={styles.kpiLabel}>MRR Estimado</p>
            <p className={styles.kpiValue}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format((stats?.mrr || 0) / 100)}
            </p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: '#fc8181' }}>
            <AlertCircle size={24} />
          </div>
          <div className={styles.kpiContent}>
            <p className={styles.kpiLabel}>Inadimplentes</p>
            <p className={styles.kpiValue}>{stats?.pastDue || 0}</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className={styles.section}>
        <h2>Ações Rápidas</h2>
        <div className={styles.actionsGrid}>
          <a href="/admin/review" className={styles.actionCard}>
            <FileCheck size={32} />
            <h3>Analisar Documentos</h3>
            <p>Verificar documentos pendentes</p>
          </a>

          <a href="/admin/instructors" className={styles.actionCard}>
            <Users size={32} />
            <h3>Ver Instrutores</h3>
            <p>Gerenciar cadastros</p>
          </a>

          <a href="/admin/payments" className={styles.actionCard}>
            <DollarSign size={32} />
            <h3>Registrar Pagamento</h3>
            <p>Lançar recebimento</p>
          </a>
        </div>
      </div>

      {/* Informação */}
      <div className={styles.infoBox}>
        <h3>✅ Painel Admin Configurado</h3>
        <p>Você está no <strong>painel administrativo</strong> separado do sistema principal.</p>
        <ul>
          <li>Layout próprio com sidebar dedicada</li>
          <li>Controle de acesso por roles (ADMIN/OPERATOR)</li>
          <li>APIs de backend no Next.js</li>
          <li>Upload de documentos</li>
          <li>Auditoria completa</li>
        </ul>
        <p><strong>Porta:</strong> 3001 (separada do frontend principal na 5174)</p>
      </div>
    </div>
  );
}
