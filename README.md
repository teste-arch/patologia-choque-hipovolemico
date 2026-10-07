# Sala Vermelha — Choque Hipovolêmico 🚨💧

Aplicação web interativa e **serious game pedagógico** com redesign moderno desenvolvido para o seminário de **Patologia Geral (Tipos de Choque)** do curso de **Enfermagem (4º período)** da **FAC — Faculdade Arquidiocesana de Curvelo (Curvelo, MG)**, orientado pela **Profa. Paula Silveira**.

Data do Seminário: **20/10/2026**  
Tema Central: **Choque Hipovolêmico (com foco em Choque Hemorrágico no Politrauma de Pelve)**

---

## 🌟 Visão Geral e Nova Arquitetura

O projeto combina uma interface moderna desenvolvida com **React 19, TanStack Start/Router, Tailwind CSS e componentes shadcn/ui** integrada com o núcleo pedagógico e dinâmico da Sala Vermelha:

1. **Central de Estudo e Shell do Plantão:**
   - Barra lateral retrátil com navegação rápida (*Visão geral*, *Trilha teórica*, *Caso clínico*, *Consulta rápida* e *Equipe e referências*).
   - Cabeçalho superior com barra de progresso em tempo real, controle de áudio dos bips do monitor e botão de **Modo Apresentação (Modo Aula)**.
   - Saudação acolhedora da mascote **"Gota"** e identificação personalizada do(a) enfermeiro(a).

2. **Trilha de Aprendizado (6 Paradas Teóricas com Minijogos):**
   - **Parada 1 — Definição:** Interação com vaso de líquido e coração pulsante.
   - **Parada 2 — Etiologia:** Flip cards e minijogo *"Classifique a Causa"*.
   - **Parada 3 — Fisiopatologia:** Cascata da resposta neuroendócrina e engrenagens da **Tríade Letal** (Hipotermia, Acidose e Coagulopatia).
   - **Parada 4 — Sinais e Sintomas:** Hotspots anatômicos em corpo humano SVG e medidor das **4 Classes de Hemorragia**.
   - **Parada 5 — Diagnóstico:** Interação *"Monte a Bandeja de Exames"* com destaque para o **FAST negativo no retroperitônio**.
   - **Parada 6 — Tratamento:** Minijogo de ordenação dos passos do **XABCDE**.

3. **Caso Clínico Interativo (Serious Game — 5 Etapas):**
   - Atendimento de **Lucas (28 anos)**, vítima de politrauma com fratura pélvica em livro aberto.
   - **Monitor Multiparamétrico com ECG em tempo real (Canvas/Web Audio API)** e paciente ilustrado em SVG com reatividade instantânea: palidez/cianose, nível de consciência, suor, tremor de frio, hematoma pélvico escalonável, cinta pélvica e manta térmica aplicáveis.
   - **Dicas da Gota:** 2 dicas por partida com eliminação de opções arriscadas.
   - **3 Finais Clínicos Possíveis:** *Final 1 (Estabilizado com confete)*, *Final 2 (Grave, porém vivo)* e *Final 3 (Evolução desfavorável)*.
   - **Plano Sistematizado de Cuidados de Enfermagem (SAE)**, linha do tempo das decisões e monitoramento de complicações tardias (*Saleh et al., Cureus, 2024*).

---

## 📂 Estrutura do Projeto

```
/
├── src/
│   ├── components/         (Componentes de interface, shadcn/ui e sala-plantao.tsx)
│   ├── routes/             (Rotas TanStack Router: index.tsx, __root.tsx)
│   ├── lib/                (Utilitários e screens.html com as atividades)
│   ├── styles.css          (Estilos globais, temas e variáveis do redesign)
│   └── router.tsx          (Configuração do TanStack Router)
├── public/
│   ├── sala/               (runtime.js com toda a lógica clínica, estado e paciente SVG)
│   ├── assets/             (Logos da Sala Vermelha, da FAC e avatares da equipe)
│   ├── favicon.svg         (Ícone da mascote Gota)
│   └── robots.txt
├── package.json            (Scripts e dependências React 19, Tailwind CSS e Vite)
├── vite.config.ts          (Configuração do Vite)
├── tsconfig.json           (Configuração TypeScript)
└── README.md
```

---

## 🚀 Como Rodar Localmente

Certifique-se de ter o **Node.js** instalado (v18+ ou v20+).

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000` (ou a porta informada no terminal).

3. Para gerar a versão de produção e testar o build:
   ```bash
   npm run build
   npm run preview
   ```

---

## ⌨️ Atalhos para o Seminário (Projetor / Sala de Aula)

- `[→]` (Seta para a direita): Avança para a próxima parada da trilha ou próxima etapa do caso.
- `[←]` (Seta para a esquerda): Retorna para a parada teórica anterior.
- `[F]`: Alterna modo Tela Cheia (*Fullscreen*).
- `[Esc]`: Fecha janelas modais abertas.
- **Botão Modo Aula:** Alterna a tipografia de alta legibilidade para projetores (16:9).

---

## 👥 Créditos da Equipe

- **Professora Orientadora:** Paula Silveira
- **Acadêmicos de Enfermagem (4º período - FAC):**
  1. Frederico Teixeira
  2. Raphael Rodrigues da Silva
  3. Ianca Marques
  4. Elisama Siqueira
  5. Isabella Mendes
  6. Thais Prates
  7. Luiz Henrique
