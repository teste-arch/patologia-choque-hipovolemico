# Sala Vermelha — Choque Hipovolêmico 🚨💧

Aplicação web interativa e **serious game pedagógico** desenvolvido para o seminário de **Patologia Geral (Tipos de Choque)** do curso de **Enfermagem (4º período)** da **FAC — Faculdade Arquidiocesana de Curvelo (Curvelo, MG)**, orientado pela **Profa. Paula Silveira**.

Data do Seminário: **20/10/2026**  
Tema Central: **Choque Hipovolêmico (com foco em Choque Hemorrágico no Politrauma de Pelve)**

---

## 🌟 Visão Geral do Projeto

O site alia rigor científico a uma abordagem lúdica, visual e acolhedora (estilo cartoon amigável, sem sangue realista ou imagens chocantes), guiado pela simpática mascote **"Gota"**.

O projeto conta com duas experiências integradas:

1. **Trilha de Aprendizado (6 Paradas Teóricas com Minijogos)**:
   - **Parada 1 — Definição:** Interação com vaso comunicante e bomba cardíaca reativa.
   - **Parada 2 — Etiologia:** Flip cards e minijogo *"Classifique a Causa"* (Hemorrágica vs. Não Hemorrágica).
   - **Parada 3 — Fisiopatologia:** Cascata da resposta neuroendócrina e engrenagens da **Tríade Letal** (Hipotermia, Acidose e Coagulopatia).
   - **Parada 4 — Sinais e Sintomas:** Hotspots anatômicos em corpo humano SVG e medidor das **4 Classes de Hemorragia** (ATLS/PHTLS).
   - **Parada 5 — Diagnóstico:** Interação *"Monte a Bandeja de Exames"* com destaque para o **FAST negativo no retroperitônio**.
   - **Parada 6 — Tratamento:** Minijogo de ordenação dos passos do **XABCDE**.

2. **Caso Clínico Interativo (Serious Game — 5 Etapas)**:
   - O usuário assume a liderança do cuidado de enfermagem de **Lucas (28 anos)**, motociclista vítima de colisão em alta velocidade com suspeita de fratura pélvica em livro aberto.
   - **Monitor Multiparamétrico com ECG em tempo real (Canvas/Audio API)** e paciente ilustrado em SVG com reatividade instantânea: palidez e cianose conforme perfusão, nível de consciência, suor, tremor de hipotermia, hematoma pélvico escalonável, cinta pélvica e manta térmica aplicáveis.
   - **Dicas da Gota:** 2 dicas por partida que eliminam alternativas arriscadas.
   - **3 Finais Clínicos Possíveis:** *Final 1 (Estabilizado com confete)*, *Final 2 (Grave, porém vivo)* e *Final 3 (Evolução desfavorável)*.
   - **Plano Sistematizado de Cuidados de Enfermagem (SAE)**, linha do tempo das escolhas e monitoramento de complicações tardias (*Saleh et al., Cureus, 2024*).

3. **Recursos de Apresentação em Sala de Aula**:
   - **Modo Apresentação (16:9)** otimizado para projetores e telões com fontes e botões ampliados.
   - Navegação por setas do teclado (`←` e `→`), tecla `F` para tela cheia e `Esc` para fechar janelas.
   - Acessibilidade WCAG AA, suporte a leitores de tela com `aria-live`, modo escuro e respeito a `prefers-reduced-motion`.

---

## 📂 Estrutura de Arquivos

```
/
├── index.html                   (Estrutura semântica e containers das telas)
├── css/
│   ├── style.css               (Variáveis, paleta, componentes, modais e modo apresentação)
│   └── animations.css          (Keyframes, ECG, mascote, confetes e acessibilidade)
├── js/
│   ├── data.js                 (TODO o conteúdo clínico, textos, equipe, referências e dados)
│   ├── state.js                (Máquina de estados reativa, deltas, clampings e regras dos 3 finais)
│   ├── ui.js                   (Gerenciador de telas, modais, mini-animações pedagógicas e resultados)
│   ├── trilha.js               (Lógica e minijogos das 6 paradas teóricas)
│   ├── monitor.js              (Monitor de beira de leito, traçado contínuo de ECG e Web Audio)
│   ├── patient.js              (Paciente Lucas em SVG cartoon dinâmico com maca e cenários)
│   └── main.js                 (Orquestração geral, atalhos do teclado e ciclo de vida)
├── assets/
│   ├── favicon.svg             (Gotinha mascote com cruz de emergência)
│   ├── logo-sala-vermelha.svg  (Sirene de emergência e mascote em SVG)
│   ├── logo-faculdade.png      (Logo institucional da FAC)
│   ├── logo-faculdade.svg      (Vetor institucional)
│   └── equipe/                 (Fotos dos 7 integrantes e da professora)
├── vercel.json                 (Clean URLs e cache para deploy estático)
└── README.md
```

---

## 🛠️ Como Personalizar o Conteúdo

### 1. Edição de Textos e Dados Clínicos (`js/data.js`)
Todo o conteúdo do site foi estritamente isolado em `js/data.js`. Não é necessário mexer no código de interface para atualizar strings:
- Para alterar textos das paradas ou do caso, edite os objetos `trilha` e `casoClinico`.
- Para alterar dados da equipe, edite `CLINICAL_DATA.equipe`.
- As anotações com `// TODO` sinalizam pontos a serem conferidos com a Profa. Paula Silveira e a bibliografia oficial da disciplina.

### 2. Substituição de Fotos e Logos (`assets/`)
- **Logo da Faculdade:** Substitua `assets/logo-faculdade.png` pelo arquivo oficial da FAC (o site possui fallback automático para SVG).
- **Fotos dos Alunos e Professora:** Adicione fotos no formato quadrado em `assets/equipe/`:
  - `paula-silveira.jpg` (Professora)
  - `frederico-teixeira.jpg`
  - `raphael-rodrigues.jpg`
  - `ianca-marques.jpg`
  - `elisama-siqueira.jpg`
  - `isabella-mendes.jpg`
  - `thais-prates.jpg`
  - `luiz-henrique.jpg`
  *(Caso alguma foto não seja fornecida, o sistema exibirá automaticamente um avatar elegante com as iniciais do integrante).*

---

## 🚀 Como Rodar Localmente

O projeto utiliza **HTML, CSS e JavaScript puros**, dispensando Node.js, compilação ou instalação de dependências.

### Opção 1: Direto no Navegador
- Dê um duplo clique no arquivo `index.html` ou arraste-o para o navegador (Google Chrome, Firefox, Safari ou Edge).

### Opção 2: Servidor Estático Local (Recomendado)
Para a melhor experiência com carregamento de fontes e áudio, inicie um servidor local simples via terminal:

**Com Python:**
```bash
python -m http.server 8000
```
Em seguida, abra: `http://localhost:8000`

**Com Node.js (se instalado):**
```bash
npx serve .
```

---

## ☁️ Deploy na Vercel (via GitHub)

1. Crie um novo repositório no seu GitHub (ex.: `sala-vermelha-choque`).
2. Faça commit e push de todos os arquivos do projeto:
   ```bash
   git init
   git add .
   git commit -m "Site Sala Vermelha - Choque Hipovolêmico (Enfermagem FAC)"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/sala-vermelha-choque.git
   git push -u origin main
   ```
3. Acesse o painel da [Vercel](https://vercel.com/) e clique em **Add New... ➔ Project**.
4. Importe o repositório do GitHub.
5. No campo **Framework Preset**, selecione **Other**.
6. Deixe o campo **Build Command** vazio (sem build). O diretório raiz `.` será servido estaticamente.
7. Clique em **Deploy**. O site estará no ar instantaneamente em uma URL pública de alta velocidade!

---

## ⌨️ Atalhos para o Seminário (Projetor / Sala de Aula)

- `[→]` (Seta para a direita): Avança para a próxima parada da trilha ou próxima etapa do caso.
- `[←]` (Seta para a esquerda): Retorna para a parada teórica anterior.
- `[F]`: Alterna modo Tela Cheia (*Fullscreen*).
- `[Esc]`: Fecha janelas modais abertas.
- **Botão 📽️ no Cabeçalho:** Alterna o *Modo Apresentação (16:9)* com tipografia de alta legibilidade.

---

## 📝 Lista de Verificação Acadêmica (`// TODO`)

- [ ] Confirmar o nome exato da disciplina no plano de ensino (*Patologia Geral*).
- [ ] Validar a edição da **NANDA-I** adotada pela faculdade para os diagnósticos de enfermagem.
- [ ] Preencher as referências ABNT completas das diretrizes complementares (**PHTLS, AHA, SBC** e bibliografia de enfermagem da disciplina).
- [ ] Validar metas de pressão arterial e reposição volêmica pré-hospitalar com a Profa. Paula Silveira.

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
