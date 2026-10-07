/**
 * DATA.JS — Repositório central de todo o conteúdo clínico e acadêmico
 * Trabalho de Enfermagem (4º período) - FAC Curvelo (20/10/2026)
 * Orientadora: Profa. Paula Silveira
 * Equipe: Sala Vermelha — Choque Hipovolêmico
 *
 * NOTA: Separação estrita entre conteúdo e código. 
 * Nenhuma string clínica fixa deve residir fora deste arquivo.
 */

const CLINICAL_DATA = {
  info: {
    titulo: "Choque Hipovolêmico: Plantão na Sala Vermelha",
    subtitulo: "Seminário Tipos de Choque • Enfermagem FAC • 20/10/2026",
    disciplina: "Patologia Geral", // TODO: validar nome exato da disciplina com a Profa. Paula
    semestre: "4º período de Enfermagem",
    instituicao: "FAC — Faculdade Arquidiocesana de Curvelo (Curvelo, MG)",
    orientadora: "Profa. Paula Silveira",
    tema: "Choque Hipovolêmico com foco em Choque Hemorrágico no Trauma Pélvico"
  },

  // Configurações do Paciente (Lucas, 28 anos)
  paciente: {
    nome: "Lucas",
    idade: "28 anos",
    mecanismo: "Colisão moto × automóvel em alta velocidade",
    estadoInicial: {
      fc: 128,         // bpm (40–180)
      pas: 88,         // mmHg (40–140)
      fr: 26,          // irpm (8–40)
      spo2: 94,        // % (70–100)
      perfusao: 40,    // 0–100 (cor, enchimento capilar)
      consciencia: 85, // 0–100 (alerta -> sonolento -> obnubilado)
      volume: 55,      // 0–100 (volume circulante efetivo)
      temperatura: 75, // 0–100 (índice térmico corporal)
      sangramento: 70  // 0–100 (intensidade da perda/hematoma ativo)
    },
    limiaresFinais: {
      // 1. Final 3 (Evolução desfavorável): pontos <= 3 OU volume < 30 OU perfusao < 20
      final3: { pontosMax: 3, volumeMin: 30, perfusaoMin: 20 },
      // 2. Final 1 (Estabilizado): pontos >= 8 E volume >= 70 E perfusao >= 55 E sangramento <= 40
      final1: { pontosMin: 8, volumeMin: 70, perfusaoMin: 55, sangramentoMax: 40 }
      // 3. Final 2 (Grave, porém vivo): todos os outros casos
    }
  },

  // -------------------------------------------------------------
  // TRILHA DE APRENDIZADO: 6 PARADAS TEÓRICAS
  // -------------------------------------------------------------
  trilha: [
    {
      id: 1,
      numero: 1,
      titulo: "O que é Choque Hipovolêmico?",
      subtitulo: "Definição e conceito hemodinâmico central",
      icone: "heart-pulse",
      conteudo: [
        "O choque hipovolêmico é uma emergência crítica decorrente da perda expressiva de volume de líquido circulante no organismo (sangue ou outros fluidos corporais).",
        "Com menos volume dentro dos vasos, o retorno de sangue para o coração (pré-carga) diminui acentuadamente, fazendo com que o coração bombeie menos a cada batimento.",
        "Como consequência direta, os órgãos e tecidos deixam de receber oxigênio e nutrientes suficientes, instalando-se a hipoperfusão celular generalizada."
      ],
      interacao: {
        tipo: "vaso-volume",
        instrucao: "Mova o slider para alterar o volume circulante e observe o que acontece com o ritmo do coração e com a Gota:",
        nivelInicial: 100, // %
        mensagensNivel: {
          alto: "Volume normal (100% a 85%): O coração bate ritmado e tranquilo. Os tecidos recebem oxigênio pleno!",
          medio: "Perda moderada (84% a 65%): O volume cai. O coração acelera (taquicardia compensatória) para tentar manter o fluxo!",
          critico: "Perda grave (< 65%): Volume muito baixo! O coração bate rápido, porém 'vazio'. As células entram em sofrimento!"
        }
      },
      paraFixar: "Menos volume → menos sangue voltando → menos sangue bombeado → células sem oxigênio."
    },

    {
      id: 2,
      numero: 2,
      titulo: "De onde vem a perda?",
      subtitulo: "Etiologia: causas hemorrágicas e não hemorrágicas",
      icone: "droplet",
      conteudo: [
        "A perda de volume pode ocorrer por sangramento visível ou oculto, mas também por desidratação e perda maciça de plasma.",
        "Identificar rapidamente a origem da perda orienta imediatamente as prioridades de reanimação da equipe de enfermagem."
      ],
      gruposFlip: [
        {
          grupo: "Hemorrágico",
          subtitulo: "Perda de sangue total (glóbulos + plasma)",
          exemplos: [
            "Trauma físico (fraturas de pelve e de ossos longos, lesões viscerais)",
            "Hemorragia digestiva alta ou baixa",
            "Causas obstétricas (descolamento prematuro de placenta, rotura uterina)",
            "Ruptura de aneurismas ou grandes vasos"
          ],
          destaque: "Risco imediato de coagulopatia e perda da capacidade de carregar oxigênio."
        },
        {
          grupo: "Não Hemorrágico",
          subtitulo: "Perda de água, eletrólitos e plasma",
          exemplos: [
            "Vômitos e diarreias graves e prolongadas",
            "Grandes queimaduras (extravasamento maciço de plasma)",
            "Perda para o 3º espaço (pancreatite aguda, obstrução intestinal)",
            "Diurese excessiva (cetoacidose diabética, uso abusivo de diuréticos)"
          ],
          destaque: "Provoca hemoconcentração e desidratação celular grave."
        }
      ],
      minijogo: {
        tipo: "classificacao",
        titulo: "Classifique a causa",
        instrucao: "Toque em cada situação clínica para classificá-la como Hemorrágica ou Não Hemorrágica:",
        cartas: [
          { id: "c1", texto: "Fratura fechada de pelve instável", tipo: "hemorragica", feedback: "Correto! A bacia pode reter mais de 2 litros de sangue no retroperitônio sem corte na pele." },
          { id: "c2", texto: "Diarreia e vômitos intensos por 3 dias", tipo: "nao_hemorragica", feedback: "Exato! Perda intensa de fluidos e eletrólitos pelo trato gastrointestinal." },
          { id: "c3", texto: "Grande queimadura de 2º e 3º grau", tipo: "nao_hemorragica", feedback: "Muito bem! Há perda maciça de plasma por lesão vascular dérmica para o terceiro espaço." },
          { id: "c4", texto: "Hemorragia digestiva alta por varizes esofágicas", tipo: "hemorragica", feedback: "Correto! Sangramento vascular maciço ativo com perda de sangue vivo." },
          { id: "c5", texto: "Pancreatite aguda grave com sequestro peritoneal", tipo: "nao_hemorragica", feedback: "Certo! Ocorre sequestro inflamatório de líquido no terceiro espaço retroperitoneal." },
          { id: "c6", texto: "Fratura exposta de fêmur com sangramento ativo", tipo: "hemorragica", feedback: "Exato! Perda considerável de sangue arterial/venoso e muscular." }
        ]
      },
      paraFixar: "Perda de sangue ou de líquidos: o resultado hemodinâmico é o mesmo, falta volume circulante."
    },

    {
      id: 3,
      numero: 3,
      titulo: "A Reação em Cadeia",
      subtitulo: "Fisiopatologia: da compensação à falência celular",
      icone: "activity",
      conteudo: [
        "Diante da perda de volume, o organismo aciona mecanismos neuroendócrinos para defender os órgãos vitais (cérebro e coração).",
        "Essa resposta é dividida em fase compensada e fase descompensada. Quando a compensação falha, a deterioração é exponencial."
      ],
      fases: [
        {
          etapa: 1,
          nome: "Queda Inicial do Volume e Débito",
          detalhe: "↓ Volume circulante → ↓ Retorno venoso (pré-carga) → ↓ Volume sistólico e Débito Cardíaco.",
          orgaos: ["vasos", "coracao"],
          compensacaoBarra: 100
        },
        {
          etapa: 2,
          nome: "Fase Compensada: Disparo Simpático e Hormonal",
          detalhe: "Barorreceptores detectam a queda de pressão → ativação do Sistema Nervoso Simpático (taquicardia + vasoconstrição periférica para poupar cérebro e coração). SRAA e ADH ativados: rins retêm água e sódio.",
          orgaos: ["cerebro", "coracao", "pele", "rins"],
          compensacaoBarra: 75
        },
        {
          etapa: 3,
          nome: "Hipoperfusão e Metabolismo Anaeróbio",
          detalhe: "Vasoconstrição prolongada reduz a oxigenação dos tecidos periféricos. As células passam a gerar energia sem oxigênio, produzindo Lactato em excesso e Acidose Metabólica.",
          orgaos: ["musculos", "figado", "sangue"],
          compensacaoBarra: 40
        },
        {
          etapa: 4,
          nome: "Fase Descompensada e Tríade Letal",
          detalhe: "Queda da contratilidade cardíaca, vasodilatação terminal e hipotensão refratária. Instala-se a Tríade Letal do Trauma: Hipotermia + Acidose + Coagulopatia, levando à disfunção de múltiplos órgãos.",
          orgaos: ["todos"],
          compensacaoBarra: 10
        }
      ],
      triadeLetal: {
        titulo: "Tríade Letal no Choque Hemorrágico do Trauma",
        componentes: [
          { nome: "Hipotermia", desc: "Reduz a função enzimática dos fatores de coagulação e a contratilidade cardíaca." },
          { nome: "Acidose", desc: "Acúmulo de lactato diminui ainda mais a resposta vascular e a coagulação." },
          { nome: "Coagulopatia", desc: "Incapacidade de formar coágulos firmes, agravando o sangramento." }
        ]
      },
      paraFixar: "No começo o corpo compensa (e disfarça). Quando a compensação acaba, a queda é rápida."
    },

    {
      id: 4,
      numero: 4,
      titulo: "O Corpo Fala",
      subtitulo: "Sinais, sintomas e a escala de perda volêmica",
      icone: "user-check",
      conteudo: [
        "A avaliação clínica atenta da enfermagem identifica o choque muito antes da pressão arterial cair.",
        "A pressão arterial sistólica é um sinal tardio de choque. O corpo manifesta sofrimento precoce na frequência cardíaca, na pele e no nível de consciência."
      ],
      hotspotsCorpo: [
        {
          id: "cerebro",
          nome: "Cérebro (Neurológico)",
          x: 50, y: 15,
          acontece: "Hipoperfusão do sistema nervoso central e ação da adrenalina.",
          observaEnfermeiro: "Ansiedade precoce, agitação motora, confusão mental, sonolência e letargia tardia."
        },
        {
          id: "coracao",
          nome: "Coração (Cardiovascular)",
          x: 52, y: 32,
          acontece: "Estímulo adrenérgico para compensar a diminuição do volume sistólico.",
          observaEnfermeiro: "Taquicardia (pulso fino e rápido). Nota: ausência de taquicardia não descarta choque em idosos, atletas ou em uso de betabloqueadores."
        },
        {
          id: "pulmoes",
          nome: "Pulmões (Respiratório)",
          x: 44, y: 36,
          acontece: "Tentativa de compensar a acidose metabólica eliminando CO₂ (hiperventilação compensatória).",
          observaEnfermeiro: "Taquipneia (frequência respiratória aumentada) e respiração profunda ou superficial."
        },
        {
          id: "rins",
          nome: "Rins (Renal)",
          x: 50, y: 48,
          acontece: "Vasoconstrição das artérias renais para desviar fluxo a órgãos nobres + ação da aldosterona e ADH.",
          observaEnfermeiro: "Oligúria (diurese < 0,5 mL/kg/h) até anúria. Urina concentrada de cor escura."
        },
        {
          id: "pele",
          nome: "Pele e Extremidades",
          x: 28, y: 55,
          acontece: "Vasoconstrição periférica intensa mediada por receptores alfa-adrenérgicos.",
          observaEnfermeiro: "Pele pálida, fria, pegajosa (sudorese fria), livedo e tempo de enchimento capilar lento (> 2 segundos)."
        },
        {
          id: "vasos",
          nome: "Vasos Sanguíneos e Pressão",
          x: 50, y: 65,
          acontece: "Esvaziamento do leito venoso e eventual perda da capacidade de manter o tônus vascular.",
          observaEnfermeiro: "Veias periféricas colapsadas ('veia difícil'), pressão de pulso convergente e hipotensão tardia."
        }
      ],
      sliderHemorragia: {
        titulo: "Medidor Didático de Perda Sanguínea (Adulto ~70 kg)",
        instrucao: "Deslize para ver as 4 Classes de Hemorragia (ATLS/PHTLS):",
        classes: [
          {
            classe: "Classe I",
            perdaPercent: "Até 15%",
            volumeAprox: "Até 750 mL",
            fc: "Normal (< 100 bpm)",
            pa: "Normal",
            fr: "14 a 20 irpm",
            mental: "Pouco ansioso ou normal",
            resumo: "Totalmente compensado. Sintomas mínimos, similar a uma doação de sangue.",
            faixaSlider: [0, 15]
          },
          {
            classe: "Classe II",
            perdaPercent: "15% a 30%",
            volumeAprox: "750 a 1500 mL",
            fc: "100 a 120 bpm (taquicardia)",
            pa: "Normal (pressão de pulso estreita)",
            fr: "20 a 30 irpm",
            mental: "Ansioso / agitado",
            resumo: "Compensação simpática visível: taquicardia, palidez, pele fria.",
            faixaSlider: [16, 30]
          },
          {
            classe: "Classe III",
            perdaPercent: "30% a 40%",
            volumeAprox: "1500 a 2000 mL",
            fc: "120 a 140 bpm",
            pa: "Diminuída (hipotensão estabelecida)",
            fr: "30 a 40 irpm",
            mental: "Ansioso / confuso",
            resumo: "Fase descompensada! A pressão cai, hipoperfusão grave. Necessita de reposição criteriosa e sangue.",
            faixaSlider: [31, 40]
          },
          {
            classe: "Classe IV",
            perdaPercent: "Acima de 40%",
            volumeAprox: "> 2000 mL",
            fc: "> 140 bpm (ou bradicardia pré-parada)",
            pa: "Muito diminuída / inaudível",
            fr: "> 35 irpm (respiração agônica)",
            mental: "Confuso / letárgico / comatoso",
            resumo: "Risco iminente de morte! Choque profundo e colapso circulatório irreversível se não revertido imediatamente.",
            faixaSlider: [41, 50]
          }
        ]
      },
      avisoClinico: "Atenção da Enfermagem: A ausência de taquicardia não exclui choque (ex.: uso de betabloqueadores, marca-passo, atletas ou neuropatia).",
      paraFixar: "A pressão só cai tarde. Taquicardia, pele fria e confusão avisam antes."
    },

    {
      id: 5,
      numero: 5,
      titulo: "Montando o Quebra-Cabeça",
      subtitulo: "Diagnóstico clínico, exames laboratoriais e imagem",
      icone: "clipboard-list",
      conteudo: [
        "O diagnóstico do choque hipovolêmico é fundamentalmente CLÍNICO e dinâmico, baseado na anamnese, mecanismo de lesão e avaliação dos sinais vitais.",
        "Exames laboratoriais e de imagem servem para quantificar a gravidade, guiar a reposição e localizar a fonte de sangramento oculto."
      ],
      alertaImportante: "Ponto-chave no Trauma de Bacia: FAST negativo para líquido livre abdominal NÃO exclui sangramento pélvico grave, pois o sangramento pélvico é predominantemente retroperitoneal!",
      bandejaExames: [
        {
          id: "ex_hemo",
          nome: "Hemograma Completo",
          tipo: "Laboratório",
          icone: "vial",
          paraQueServe: "Avalia hemoglobina, hematócrito e plaquetas. No início do sangramento agudo, a hemoglobina pode estar falsamente normal até haver hemodiluição!",
          papelEnfermagem: "Coleta em tubo EDTA com identificação precisa à beira do leito e envio com prioridade máxima."
        },
        {
          id: "ex_tipagem",
          nome: "Tipagem Sanguínea e Prova Cruzada",
          tipo: "Banco de Sangue",
          icone: "droplets",
          paraQueServe: "Define o grupo ABO/Rh e compatibilidade para transfusão de concentrado de hemácias e plasma.",
          papelEnfermagem: "Etapa mais crítica de segurança: dupla checagem rigorosa na coleta e identificação da pulseira do paciente."
        },
        {
          id: "ex_lactato",
          nome: "Lactato Sérico e Gasometria",
          tipo: "Marcador de Perfusão",
          icone: "activity",
          paraQueServe: "Avalia a hipoperfusão celular e a acidose metabólica. O clareamento do lactato guia o sucesso da ressuscitação.",
          papelEnfermagem: "Coleta com técnica asséptica em seringa heparinizada, transporte refrigerado imediato ao laboratório."
        },
        {
          id: "ex_coagulo",
          nome: "Coagulograma (TP, TTPa, Fibrinogênio)",
          tipo: "Hemostasia",
          icone: "shield-alert",
          paraQueServe: "Monitora coagulopatia precoce induzida pelo trauma (parte crucial da tríade letal).",
          papelEnfermagem: "Preenchimento correto do tubo de citrato até a linha de marcação para não alterar a proporção sangue/anticoagulante."
        },
        {
          id: "ex_fast",
          nome: "FAST / eFAST (Ultrassom à beira do leito)",
          tipo: "Imagem",
          icone: "radio",
          paraQueServe: "Detecta líquido livre no pericárdio, pleura e cavidade peritoneal. Atenção: não avalia o retroperitônio!",
          papelEnfermagem: "Posicionar o paciente, preparar o aparelho, acoplar gel e auxiliar a equipe médica sem desestabilizar a pelve."
        },
        {
          id: "ex_tc",
          nome: "Tomografia Computadorizada (TC)",
          tipo: "Imagem Definitiva",
          icone: "scan",
          paraQueServe: "Mapeamento anatômico detalhado das fraturas e sangramentos vasculares em pelve e abdome.",
          papelEnfermagem: "Atenção: JAMAIS transportar paciente hemodinamicamente instável para a sala de TC! Primeiro estabilizar na Sala Vermelha."
        }
      ],
      paraFixar: "Exame normal no início não descarta hemorragia. Clínica e tendência dos sinais vitais mandam."
    },

    {
      id: 6,
      numero: 6,
      titulo: "Ordem de Prioridades",
      subtitulo: "Tratamento baseado no mnemônico XABCDE",
      icone: "check-circle-2",
      conteudo: [
        "No choque hemorrágico traumático, o tempo é o maior inimigo do paciente. As ações devem seguir a lógica das maiores ameaças à vida primeiro.",
        "A abordagem sistemática XABCDE garante que o controle do sangramento exanguinante venha antes de qualquer outra medida secundária."
      ],
      minijogoXabcde: {
        titulo: "Ordene os passos do atendimento XABCDE",
        instrucao: "Toque nos passos na ordem correta da abordagem do trauma (do primeiro ao último):",
        passosCorretos: [
          {
            letra: "X",
            titulo: "Controle da Hemorragia Exsanguinante",
            descricao: "Comprimir sangramentos externos graves e estabilizar pelve instável com cinta pélvica.",
            ordem: 1
          },
          {
            letra: "A",
            titulo: "Via Aérea com Proteção Cervical",
            descricao: "Garantir permeabilidade da via aérea mantendo alinhamento da coluna cervical.",
            ordem: 2
          },
          {
            letra: "B",
            titulo: "Boa Ventilação e Oxigenação",
            descricao: "Avaliar padrão respiratório, expansibilidade torácica e ofertar O₂ suplementar conforme necessidade.",
            ordem: 3
          },
          {
            letra: "C",
            titulo: "Circulação e Reposição Criteriosa",
            descricao: "Acessos venosos calibrosos, reposição de fluidos aquecidos/sangue e monitorização contínua.",
            ordem: 4
          },
          {
            letra: "D",
            titulo: "Disfunção Neurológica",
            descricao: "Avaliar nível de consciência, escala de coma e reatividade pupilar.",
            ordem: 5
          },
          {
            letra: "E",
            titulo: "Exposição com Prevenção da Hipotermia",
            descricao: "Despir para inspecionar lesões e cobrir imediatamente com manta térmica.",
            ordem: 6
          }
        ]
      },
      paraFixar: "Primeiro o que mata mais rápido: o sangramento. Depois via aérea, circulação e aquecimento."
    }
  ],

  // -------------------------------------------------------------
  // CASO CLÍNICO INTERATIVO: LUCAS, 28 ANOS (5 ETAPAS)
  // -------------------------------------------------------------
  casoClinico: {
    pacienteInfo: {
      nome: "Lucas",
      idade: "28 anos",
      historia: "Lucas trafegava de motocicleta quando sofreu colisão em alta velocidade contra um automóvel. O impacto lateral projetou seu corpo contra o meio-fio.",
      exameFisicoInicial: "Consciente porém muito ansioso, face pálida, sudorese fria, queixando-se de dor intensa na pelve. Membro inferior direito visivelmente encurtado e em rotação externa ('livro aberto'). Hematoma extenso em flanco e períneo. Não há sangramento externo ativo evidente em vias aéreas ou membros."
    },

    etapas: [
      {
        id: 1,
        numero: 1,
        fase: "FASE 1 — ATENDIMENTO PRÉ-HOSPITALAR (APH)",
        titulo: "Na Cena do Acidente",
        cenario: "rua",
        situacao: "Você é o(a) enfermeiro(a) da unidade de suporte. Ao chegar, encontra Lucas caído na via, ansioso, pálido, com sudorese fria e enchimento capilar lento (4 segundos). FC 128 bpm, PA 88/53 mmHg, FR 26 irpm, SpO2 94%. Membro inferior direito encurtado e rotação externa, com dor pélvica excruciante.",
        contexto: "Com a perda de sangue na pelve fraturada, o volume circulante diminui drasticamente, reduzindo o retorno venoso (pré-carga) e o débito cardíaco. O organismo compensa com taquicardia e vasoconstrição periférica intensa (pele fria e pálida). O anel pélvico é profusamente vascularizado por plexos venosos e ramos das artérias ilíacas, podendo acumular litros de sangue de forma oculta.",
        sinais: [
          "Taquicardia compensatória (128 bpm)",
          "Hipotensão arterial precoce (88/53 mmHg)",
          "Pele fria, pálida e sudorética com tempo de enchimento capilar de 4s",
          "Taquipneia (26 irpm) e ansiedade intensa",
          "Deformidade pélvica em rotação externa e hematomas em flanco"
        ],
        miniAnimacao: "cinta-pelvica",
        miniAnimacaoTitulo: "Estabilização Pélvica Precoce",
        miniAnimacaoDesc: "A cinta pélvica reduz o volume da pelve óssea e promove tamponamento hemostático dos vasos rompidos.",
        
        opcoes: [
          {
            id: "1A",
            texto: "Seguir a abordagem XABCDE: verificar hemorragias externas, proteger coluna cervical, assegurar via aérea e oxigenação conforme avaliação, monitorizar, aplicar cinta pélvica ao nível dos trocânteres maiores, aquecer com manta e preparar saída rápida da cena.",
            tipo: "correta",
            pontos: 2,
            feedback: "Excelente conduta de enfermagem! A prioridade imediata é conter o foco oculto de sangramento fechando a pelve e protegendo contra a tríade letal com aquecimento precoce, sem demorar na via pública.",
            efeitos: { fc: -6, pas: 6, fr: -2, spo2: 3, perfusao: 5, consciencia: 0, volume: 0, temperatura: 5, sangramento: -25 },
            dicaGota: "Lembre-se da abordagem XABCDE: estancar e conter a fonte da perda de sangue vem antes de tudo!"
          },
          {
            id: "1B",
            texto: "Realizar imobilização completa e demorada com prancha rígida longa, colar, tirantes e coxins cefálicos antes de inspecionar ou intervir na deformidade pélvica.",
            tipo: "parcial",
            pontos: 1,
            feedback: "Cuidado com o tempo de cena! Embora a restrição de movimento da coluna seja importante, gastar minutos preciosos na via sem conter o sangramento pélvico ativo acelera o choque hemorrágico.",
            efeitos: { fc: 4, pas: -2, fr: 1, spo2: 0, perfusao: -3, consciencia: -3, volume: -5, temperatura: -5, sangramento: 0 },
            dicaGota: "A imobilização não pode retardar o tratamento do choque. O tempo de cena precisa ser mínimo!"
          },
          {
            id: "1C",
            texto: "Examinar repetidamente a estabilidade do anel pélvico comprimindo as cristas ilíacas para dentro e para baixo para testar a mobilidade óssea.",
            tipo: "errada",
            pontos: 0,
            feedback: "Conduta perigosa! Testar a estabilidade comprimindo e balançando a pelve desaloja coágulos já formados e pode lacerar vasos ilíacos e plexos venosos, transformando uma fratura em sangramento incontrolável.",
            efeitos: { fc: 10, pas: -8, fr: 2, spo2: -2, perfusao: -8, consciencia: -5, volume: -10, temperatura: -5, sangramento: 15 },
            dicaGota: "Nunca balance ou aperte uma bacia suspeita de fratura! Pelve suspeita deve ser imobilizada, nunca testada repetidamente."
          }
        ],
        cuidadosEnfermagem: [
          "Realizar avaliação rápida e sistemática seguindo o mnemônico XABCDE // TODO: validar com PHTLS",
          "Manter alinhamento e proteção da coluna cervical",
          "Monitorizar continuamente sinais vitais (FC, PA, SpO2 e ritmo)",
          "Aplicar a cinta pélvica posicionada estritamente sobre a altura dos grandes trocânteres femorais",
          "Cobrir o paciente com manta térmica para prevenção precoce da hipotermia",
          "Manter diálogo acolhedor, esclarecendo os passos para reduzir o estresse adrenérgico"
        ],
        paraFixar: "Choque no trauma = procurar e controlar o sangramento primeiro. Pelve suspeita não se balança: se estabiliza.",
        vocesabia: "O retroperitônio e o espaço pélvico podem acumular mais de 2 a 3 litros de sangue sem exteriorização visível por feridas!"
      },

      {
        id: 2,
        numero: 2,
        fase: "FASE 1 — ATENDIMENTO PRÉ-HOSPITALAR (APH)",
        titulo: "No Transporte da Ambulância",
        cenario: "ambulancia",
        situacao: "Lucas já está embarcado na ambulância com a cinta pélvica posicionada. Ele permanece pálido, com pulso filiforme (122 bpm) e PA 92/55 mmHg. Há um hospital geral básico a 4 minutos sem cirurgia de trauma e um Centro de Trauma Terciário com Banco de Sangue a 14 minutos.",
        contexto: "O paciente em choque hemorrágico grave necessita de intervenção definitiva para hemostasia (hemodinâmica com embolização ou cirurgia de controle de danos) e hemocomponentes. A infusão indiscriminada de grandes volumes de soro fisiológico gelado dilui os fatores de coagulação, causa acidose hiperclorêmica e resfria o paciente.",
        sinais: [
          "PA limítrofe com resposta volêmica instável",
          "Frequência cardíaca persistentemente elevada",
          "Pele fria e pulso radial débil",
          "Nível de consciência oscilando entre agitação e prostração"
        ],
        miniAnimacao: "triade-letal",
        miniAnimacaoTitulo: "Prevenção da Tríade Letal",
        miniAnimacaoDesc: "Hipotermia + Acidose + Coagulopatia criam um círculo vicioso que paralisa a coagulação natural.",
        
        opcoes: [
          {
            id: "2A",
            texto: "Transportar rapidamente ao Centro de Trauma Terciário, puncionar acesso venoso periférico calibroso em trajeto sem atrasar a saída, iniciar reposição criteriosa com fluidos aquecidos conforme prescrição médica e protocolo, mantendo monitorização contínua e pré-notificando a Sala Vermelha via regulação médica.",
            tipo: "correta",
            pontos: 2,
            feedback: "Conduta perfeita! No trauma grave, o paciente certo deve ir para o destino certo. A pré-notificação permite que a Sala Vermelha e o Banco de Sangue estejam prontos antes mesmo da chegada da ambulância.",
            efeitos: { fc: -4, pas: 6, fr: -1, spo2: 1, perfusao: 5, consciencia: 3, volume: 5, temperatura: 5, sangramento: -10 },
            dicaGota: "O destino hospitalar e a comunicação prévia fazem toda a diferença para o paciente de trauma grave!"
          },
          {
            id: "2B",
            texto: "Manter a ambulância parada na cena tentando punções venosas repetidas em ambos os membros e realizando procedimentos secundários antes de iniciar o deslocamento.",
            tipo: "parcial",
            pontos: 1,
            feedback: "Acesso venoso é fundamental, porém permanecer parado na cena atrasa o tratamento cirúrgico definitivo. Punções e monitorizações em pacientes de trauma devem ser feitas a caminho do hospital sempre que possível.",
            efeitos: { fc: 4, pas: -3, fr: 0, spo2: 0, perfusao: -4, consciencia: -3, volume: -6, temperatura: -6, sangramento: 5 },
            dicaGota: "A 'hora de ouro' não permite ficar parado na cena para tarefas que podem ser executadas no deslocamento."
          },
          {
            id: "2C",
            texto: "Desviar o trajeto e levar imediatamente ao hospital básico mais próximo, que não conta com suporte de cirurgia nem banco de sangue, sem avisar a regulação prévia.",
            tipo: "errada",
            pontos: 0,
            feedback: "Decisão inadequada! Parar em um hospital sem suporte cirúrgico ou hemoterápico retarda a intervenção que realmente salva a vida de Lucas, necessitando de uma transferência secundária de altíssimo risco.",
            efeitos: { fc: 8, pas: -8, fr: 1, spo2: -1, perfusao: -8, consciencia: -6, volume: -10, temperatura: -8, sangramento: 10 },
            dicaGota: "O hospital mais próximo nem sempre é o hospital capacitado para trauma com choque hemorrágico."
          }
        ],
        cuidadosEnfermagem: [
          "Puncionar acesso venoso periférico de grosso calibre (14G ou 16G) sem retardar o deslocamento",
          "Administrar fluidos aquecidos de forma criteriosa conforme prescrição médica e protocolo institucional // TODO: validar com PHTLS",
          "Manter monitorização eletrocardiográfica, oximetria e pressão arterial contínuas",
          "Pré-notificar a equipe da Sala Vermelha através da Central de Regulação Médica",
          "Registrar detalhadamente horários, volumes infundidos, evolução dos sinais vitais e intercorrências",
          "Proporcionar conforto térmico e apoio psicológico contínuo ao paciente"
        ],
        paraFixar: "No trauma grave, o paciente certo vai para o lugar certo, rápido e com o hospital avisado.",
        vocesabia: "Infusão excessiva de cristaloides dilui os fatores de coagulação e as plaquetas, além de aumentar a pressão intravascular rompendo coágulos recentes!"
      },

      {
        id: 3,
        numero: 3,
        fase: "FASE 2 — PRONTO-SOCORRO (SALA VERMELHA)",
        titulo: "Chegada à Sala Vermelha",
        cenario: "sala-vermelha",
        situacao: "Lucas dá entrada na Sala Vermelha. A PA sobe brevemente para 96/60 mmHg com a infusão do APH, mas logo recua para 84/50 mmHg (resposta transitória). FC 124 bpm. O exame de ultrassom FAST à beira do leito é NEGATIVO para líquido livre intraperitoneal. A dosagem rápida de lactato resulta em 4,8 mmol/L (alto) e pH 7,24 (acidose).",
        contexto: "A resposta transitória a fluidos é a marca registrada do sangramento contínuo ativo. O FAST negativo NÃO afasta hemorragia pélvica grave, pois a maior parte do sangue das fraturas de pelve se aloja no espaço retroperitoneal. O lactato elevado e a acidose confirmam hipoperfusão tecidual e metabolismo anaeróbio grave.",
        sinais: [
          "Resposta transitória à reposição volêmica prévia",
          "Lactato elevado (4,8 mmol/L) e acidose metabólica",
          "Ultrassom FAST negativo com bacia clinicamente instável",
          "Palidez cutânea acentuada e sudorese fria mantida"
        ],
        miniAnimacao: "fast-negativo",
        miniAnimacaoTitulo: "Atenção ao Retroperitônio",
        miniAnimacaoDesc: "O FAST analisa a cavidade peritoneal; o sangue da bacia se esconde no retroperitônio e na pelve profunda.",
        
        opcoes: [
          {
            id: "3A",
            texto: "Realizar passagem de caso estruturada (SBAR), manter e checar a cinta pélvica, monitorização multiparamétrica, garantir 2 acessos venosos periféricos calibrosos, coletar amostras com rigorosa identificação (hemograma, tipagem, coagulograma, gasometria/lactato) conforme prescrição médica, manter aquecimento ativo com manta térmica, acionar protocolo de transfusão maciça do serviço e comunicar imediatamente cirurgia geral, ortopedia e radiologia intervencionista.",
            tipo: "correta",
            pontos: 2,
            feedback: "Conduta de enfermagem brilhante e sincronizada! Choque hemorrágico exige sangue e hemostasia definitiva. A enfermagem garante os acessos, a segurança na coleta, o controle térmico e aciona a cadeia de resposta multidisciplinar.",
            efeitos: { fc: -8, pas: 8, fr: -1, spo2: 2, perfusao: 10, consciencia: 5, volume: 15, temperatura: 5, sangramento: -25 },
            dicaGota: "Um FAST negativo não descarta sangramento na bacia! Foque em amostras corretas, sangue e acionamento da equipe de trauma."
          },
          {
            id: "3B",
            texto: "Acreditar que não há sangramento ativo devido ao FAST negativo, continuar apenas infundindo bolsas de soro fisiológico e aguardar o agendamento de uma tomografia de corpo inteiro.",
            tipo: "parcial",
            pontos: 1,
            feedback: "Equívoco perigoso! O FAST negativo exclui hemoperitônio maciço, mas não hematoma retroperitoneal de bacia. Continuar apenas com soro aumenta a hemodiluição e o resfriamento.",
            efeitos: { fc: 2, pas: -4, fr: 0, spo2: 0, perfusao: -5, consciencia: -3, volume: -3, temperatura: -8, sangramento: 5 },
            dicaGota: "Cuidado: cristaloide puro não transporta oxigênio e piora a hipotermia. Lucas precisa de hemostasia e sangue!"
          },
          {
            id: "3C",
            texto: "Afrouxar e retirar a cinta pélvica para palpar a bacia e encaminhar o paciente imediatamente, ainda instável, para a sala de tomografia computadorizada.",
            tipo: "errada",
            pontos: 0,
            feedback: "Conduta com alto risco de desfecho fatal! Remover a cinta desfaz o tamponamento da fratura e reabre o sangramento volumoso. Pacientes hemodinamicamente instáveis nunca devem ser levados para a tomografia.",
            efeitos: { fc: 10, pas: -12, fr: 1, spo2: -3, perfusao: -10, consciencia: -8, volume: -12, temperatura: -4, sangramento: 20 },
            dicaGota: "Jamais remova a cinta pélvica e nunca transporte paciente instável para a tomografia!"
          }
        ],
        cuidadosEnfermagem: [
          "Realizar passagem de plantão estruturada com a equipe multidisciplinar (ferramenta SBAR) // TODO: validar protocolo FAC",
          "Manter monitorização contínua de ECG, PNI, SpO2 e capnografia se entubado",
          "Garantir dois acessos venosos periféricos de grosso calibre (14G ou 16G) e checar permeabilidade",
          "Proceder à coleta rigorosa de exames laboratoriais com identificação positiva do paciente à beira do leito",
          "Manter a cinta pélvica ajustada sem afrouxamento indevido",
          "Instalar medidas ativas de aquecimento (manta térmica com ar aquecido forçado e infusores aquecidos)",
          "Controlar débito urinário e balanço hídrico rigoroso",
          "Comunicar à equipe médica alterações hemodinâmicas imediatas"
        ],
        paraFixar: "FAST negativo não descarta sangramento pélvico. Instável: sangue, calor e controle da fonte, não tomografia.",
        vocesabia: "Em relato de caso publicado (Saleh et al., Cureus, 2024), um paciente com fratura em livro aberto apresentou-se com FC de 76 bpm: a ausência de taquicardia clássica pode ocorrer e não descarta choque grave!"
      },

      {
        id: 4,
        numero: 4,
        fase: "FASE 2 — PRONTO-SOCORRO (SALA VERMELHA)",
        titulo: "Transfusão com Segurança",
        cenario: "sala-vermelha",
        situacao: "O Banco de Sangue libera a primeira bolsa de concentrado de hemácias para Lucas. O ambiente da Sala Vermelha está agitado, com múltiplos profissionais atuando simultaneamente. A prescrição médica de hemocomponente está lançada e cabe à equipe de enfermagem instalar e vigiar o procedimento.",
        contexto: "Em situações de extrema urgência, a transfusão de hemocomponentes é uma intervenção hemostática e de transporte de oxigênio que salva vidas. No entanto, erros de identificação de paciente ou de bolsa são as causas primárias de reações transfusionais hemolíticas agudas graves.",
        sinais: [
          "Necessidade de reposição volêmica com carreador de oxigênio",
          "Risco iminente de reação transfusional se houver quebra de barreira de segurança",
          "Sinais de alerta durante infusão: taquicardia súbita, hipotensão, febre, calafrios, broncoespasmo ou lombalgia"
        ],
        miniAnimacao: "transfusao-segura",
        miniAnimacaoTitulo: "Cultura de Segurança Transfusional",
        miniAnimacaoDesc: "Dupla checagem à beira do leito: conferência simultânea da pulseira do paciente e da etiqueta da bolsa.",
        
        opcoes: [
          {
            id: "4A",
            texto: "Conferir rigorosamente a prescrição médica, realizar a dupla checagem à beira do leito com outro profissional (conferindo nome completo, prontuário, tipo sanguíneo e número da bolsa), aferir e registrar sinais vitais antes de iniciar, instalar com equipo específico e filtro, manter observação direta nos primeiros 10 a 15 minutos e reavaliar continuamente.",
            tipo: "correta",
            pontos: 2,
            feedback: "Conduta de enfermagem exemplar! A pressa da emergência nunca pode suprimir a dupla checagem. A vigilância nos primeiros minutos é decisiva para identificar precocemente qualquer incompatibilidade imunológica ou reação adversa.",
            efeitos: { fc: -4, pas: 6, fr: -1, spo2: 2, perfusao: 5, consciencia: 3, volume: 8, temperatura: 3, sangramento: 0 },
            dicaGota: "Segurança do paciente em primeiro lugar! Dupla checagem e vigilância no leito salvam vidas."
          },
          {
            id: "4B",
            texto: "Realizar a checagem correta antes de conectar a bolsa, porém retirar-se do leito logo em seguida para cumprir outras tarefas administrativas, sem monitorar os sinais vitais durante a infusão.",
            tipo: "parcial",
            pontos: 1,
            feedback: "A checagem inicial foi correta, mas o abandono da vigilância durante os primeiros minutos de infusão impede a identificação precoce de reações agudas potencialmente fatais.",
            efeitos: { fc: 2, pas: 0, fr: 0, spo2: 0, perfusao: -2, consciencia: -1, volume: 2, temperatura: 0, sangramento: 0 },
            dicaGota: "A maior parte das reações transfusionais graves manifesta-se nos primeiros 15 minutos de infusão!"
          },
          {
            id: "4C",
            texto: "Diante do clima tenso de urgência, conectar a bolsa rapidamente conferindo apenas a etiqueta do hemocomponente de forma solitária, pulando a conferência da pulseira para 'ganhar tempo'.",
            tipo: "errada",
            pontos: 0,
            feedback: "Erro gravíssimo de segurança do paciente! A incompatibilidade ABO por falha de checagem provoca hemólise intravascular maciça, choque refratário e coagulação intravascular disseminada (CIVD).",
            efeitos: { fc: 8, pas: -10, fr: 3, spo2: -3, perfusao: -10, consciencia: -6, volume: -5, temperatura: 0, sangramento: 0 },
            dicaGota: "Jamais pule a dupla checagem! Velocidade sem segurança transforma o tratamento em risco de óbito."
          }
        ],
        cuidadosEnfermagem: [
          "Conferir a prescrição médica e indicação formal do hemocomponente // TODO: validar protocolo do serviço",
          "Executar a dupla checagem obrigatória à beira do leito com dois profissionais de saúde",
          "Conferir dados: nome completo, data de nascimento, número do prontuário, tipagem ABO/Rh da bolsa e do paciente, validade e integridade física da bolsa",
          "Aferir sinais vitais completos antes de abrir o equipo, aos 10–15 minutos de infusão e ao término",
          "Utilizar equipo específico com filtro para hemocomponentes e aquecedor de infusão rápida conforme protocolo",
          "Suspender IMEDIATAMENTE a transfusão e acionar a equipe médica caso surjam febre, calafrios, dispneia, hipotensão ou queixas de dor",
          "Manter a via venosa permeável com solução salina em via exclusiva e guardar a bolsa para análise laboratorial se houver reação",
          "Registrar horários de início e término, número de lote da bolsa e ocorrências em prontuário"
        ],
        paraFixar: "Pressa não dispensa a dupla checagem. Na transfusão, quem vigia detecta a reação a tempo.",
        vocesabia: "Reações transfusionais hemolíticas agudas por incompatibilidade ABO decorrem em mais de 90% dos casos de falhas humanas na checagem de etiquetas e identificação do paciente à beira do leito!"
      },

      {
        id: 5,
        numero: 5,
        fase: "FASE 2 — PRONTO-SOCORRO (SALA VERMELHA)",
        titulo: "Suspeita de Lesão Associada",
        cenario: "sala-vermelha",
        situacao: "Com a transfusão em curso e a cinta mantida, Lucas apresenta melhora dos parâmetros hemodinâmicos. Ao preparar o cateterismo vesical para o rigoroso controle de diurese, você observa sangramento ativo no meato uretral (uretrorragia) e acentuado hematoma em bolsa escrotal e região perineal ('hematoma em borboleta').",
        contexto: "Em traumas pélvicos de alta energia (especialmente fraturas do tipo livro aberto e cisalhamento vertical), a ruptura da uretra membranosa e lesões de bexiga são frequentes. A tentativa de passagem de sonda vesical de demora às cegas pode transformar uma laceração uretral parcial em secção completa, criando falso trajeto, abscesso pélvico e complicações urológicas permanentes.",
        sinais: [
          "Sangue vivo visível no meato uretral externo (uretrorragia)",
          "Hematoma perineal e escrotal proeminente",
          "Bexigoma palpável ou dor suprapúbica associada",
          "Incapacidade de micção espontânea"
        ],
        miniAnimacao: "uretra",
        miniAnimacaoTitulo: "Alerta Vermelho: Suspeita de Lesão Uretral",
        miniAnimacaoDesc: "Não passe sonda às cegas! A tentativa pode converter lesão parcial em ruptura completa da uretra.",
        
        opcoes: [
          {
            id: "5A",
            texto: "Suspender imediatamente qualquer tentativa de cateterismo vesical de demora ou alívio, comunicar prontamente à equipe médica e à urologia sobre a tríade de achados (uretrorragia, hematoma perineal e dor), registrar a conduta e monitorar abaulamento suprapúbico e sinais de retenção urinária enquanto se aguarda avaliação urológica e/ou cistostomia suprapúbica.",
            tipo: "correta",
            pontos: 2,
            feedback: "Conduta perfeita e de alta destreza clínica de enfermagem! Reconhecer os sinais de contraindicação do cateterismo vesical às cegas protege o paciente contra sequelas anatômicas definitivas. A comunicação ágil orienta a conduta correta (uretrocistografia retrógrada ou cistostomia suprapúbica).",
            efeitos: { fc: 0, pas: 0, fr: 0, spo2: 0, perfusao: 2, consciencia: 2, volume: 0, temperatura: 0, sangramento: 0 },
            dicaGota: "Sangue no meato da uretra é sinal de pare! Jamais introduza sonda vesical às cegas nesta situação."
          },
          {
            id: "5B",
            texto: "Tentar passar a sonda vesical de silicone 'com muita delicadeza', prometendo parar caso sinta qualquer resistência mecânica na uretra.",
            tipo: "parcial",
            pontos: 1,
            feedback: "Conduta de alto risco! Mesmo com aparente delicadeza, a ponta do cateter pode romper a mucosa lesada e invadir o hematoma pélvico circundante, levando a infecção grave do sítio de fratura.",
            efeitos: { fc: 2, pas: -1, fr: 0, spo2: 0, perfusao: -2, consciencia: 0, volume: -3, temperatura: 0, sangramento: 3 },
            dicaGota: "A presença de uretrorragia contraindica qualquer tentativa de sondagem sem imagem prévia!"
          },
          {
            id: "5C",
            texto: "Insistir na introdução rápida de uma sonda de alívio fina para drenar a bexiga antes de chamar a equipe médica, alegando urgência em medir a diurese.",
            tipo: "errada",
            pontos: 0,
            feedback: "Conduta incorreta e prejudicial! A passagem inadvertida pode dilacerar a uretra, extravasar urina para o retroperitônio e infectar o hematoma pélvico, agravando exponencialmente o prognóstico de Lucas.",
            efeitos: { fc: 4, pas: -3, fr: 1, spo2: 0, perfusao: -4, consciencia: -2, volume: -5, temperatura: 0, sangramento: 5 },
            dicaGota: "Nunca passe sonda às cegas com sangue no meato. Comunique à equipe médica imediatamente!"
          }
        ],
        cuidadosEnfermagem: [
          "Inspecionar rigorosamente o meato uretral e a região perineal antes de qualquer procedimento de sondagem",
          "Interromper o procedimento na vigência de uretrorragia, hematoma escrotal/perineal ou próstata elevada // TODO: validar protocolo de trauma",
          "Comunicar imediatamente a equipe médica e o plantonista da urologia utilizando técnica estruturada de comunicação",
          "Aferir e registrar volume urinário espontâneo se houver, presença de hematúria macroscópica e palpação do globo vesical",
          "Separar bandeja e materiais estéreis caso a equipe médica opte por punção ou cistostomia suprapúbica",
          "Orientar o paciente a não realizar esforço miccional até a definição diagnóstica"
        ],
        paraFixar: "Sangue no meato + hematoma perineal = pense em lesão uretral. Não sonde às cegas: comunique.",
        vocesabia: "Segundo estudos em trauma pélvico (Saleh et al., Cureus, 2024), lesões associadas de uretra e bexiga acometem até 15% das fraturas em livro aberto, exigindo abordagem multidisciplinar coordenada!"
      }
    ]
  },

  // -------------------------------------------------------------
  // DESFECHOS / FINAIS DO CASO CLÍNICO
  // -------------------------------------------------------------
  finais: {
    final1: {
      id: "estabilizado",
      titulo: "Final 1 — Paciente Estabilizado e Encaminhado com Sucesso!",
      classificacao: "Excelente Desempenho Clínico",
      subtitulo: "A atuação rápida e baseada em evidências preservou a vida de Lucas.",
      mensagem: "Parabéns, enfermeiro(a)! Suas decisões clínicas foram certeiras: a aplicação precoce da cinta conteve a hemorragia pélvica oculta, o transporte sem atrasos garantiu a chegada ao centro de trauma, e a abordagem na Sala Vermelha com controle térmico e transfusão segura reverteu a hipoperfusão tecidual.",
      estadoFinalDesc: "Lucas apresenta PA 112/68 mmHg, FC 88 bpm, perfusão periférica recuperada e lactato em queda. Segue agora estabilizado para o centro cirúrgico para fixação pélvica definitiva e posterior vigilância em UTI.",
      icone: "party-popper",
      cor: "#2EC4B6",
      statusBadge: "Sucesso Hemodinâmico"
    },
    final2: {
      id: "grave_vivo",
      titulo: "Final 2 — Estado Grave, Porém Vivo",
      classificacao: "Desempenho Parcial",
      subtitulo: "Lucas sobreviveu à fase inicial, mas enfrenta instabilidade residual e prognóstico reservado.",
      mensagem: "Lucas permanece vivo, mas algumas condutas parciais ou atrasos de cena prolongaram o tempo de hipoperfusão celular. O paciente desenvolveu acidose metabólica moderada e resfriamento corporal que dificultam a estabilização completa.",
      estadoFinalDesc: "O paciente chega ao centro cirúrgico hemodinamicamente limítrofe (PA 90/55 mmHg, FC 122 bpm, lactato ainda alto), necessitando de drogas vasoativas e suporte intensivo prolongado.",
      icone: "alert-triangle",
      cor: "#FFD166",
      statusBadge: "Instabilidade Residual"
    },
    final3: {
      id: "desfavoravel",
      titulo: "Final 3 — Evolução Desfavorável",
      classificacao: "Revisão de Condutas Necessária",
      subtitulo: "No choque do trauma grave, minutos e decisões inadequadas custam vidas.",
      mensagem: "A evolução foi desfavorável. Decisões como manipulação repetida da bacia, atraso no transporte, remoção da cinta ou procedimentos inadvertidos exacerbaram o sangramento retroperitoneal e instalaram a tríade letal (hipotermia, acidose e coagulopatia refratária).",
      estadoFinalDesc: "Lucas entrou em colapso cardiocirculatório irreversível. O aprendizado clínico em emergência se faz compreendendo as falhas: revise cada etapa e tente novamente!",
      icone: "heart-crack",
      cor: "#E63946",
      statusBadge: "Colapso Circulatório"
    }
  },

  // -------------------------------------------------------------
  // PLANO DE CUIDADOS DE ENFERMAGEM (EXIBIDO NO FINAL)
  // -------------------------------------------------------------
  planoCuidados: {
    titulo: "Plano Sistematizado de Cuidados de Enfermagem (SAE)",
    notaAcademica: "// TODO: validar rótulos diagnósticos com a edição oficial da NANDA-I adotada pela disciplina; códigos numéricos mantidos sem suposição.",
    diagnosticos: [
      {
        titulo: "Risco de choque e Volume de líquidos deficiente",
        evidenciadoPor: "Perda ativa de volume sanguíneo secundária a fratura pélvica instável.",
        intervencoes: [
          "Monitorar rigorosamente sinais vitais a cada 5–15 minutos (tendência da FC, PA e oximetria).",
          "Manter a cinta pélvica ajustada sobre os trocânteres femorais.",
          "Garantir e manter 2 acessos venosos periféricos calibrosos funcionantes.",
          "Administrar reposição de fluidos aquecidos e hemocomponentes conforme prescrição médica e protocolo institucional."
        ],
        resultadosEsperados: "Pressão arterial média mantida, frequência cardíaca em declínio e diurese adequada."
      },
      {
        titulo: "Perfusão tissular periférica ineficaz e Débito cardíaco diminuído",
        evidenciadoPor: "Pele fria, sudorese, tempo de enchimento capilar > 2s, lactato sérico elevado.",
        intervencoes: [
          "Avaliar pulsos periféricos, temperatura da pele e enchimento capilar a cada ciclo de reavaliação.",
          "Acompanhar níveis séricos de lactato, gasometria arterial e déficit de bases.",
          "Otimizar oferta de oxigênio conforme prescrição e padrão ventilatório."
        ],
        resultadosEsperados: "Pele aquecida e corada, clareamento progressivo do lactato sérico e melhora do sensório."
      },
      {
        titulo: "Risco de hipotermia",
        evidenciadoPor: "Exposição ambiental, perda de termorregulação e infusão de soluções.",
        intervencoes: [
          "Instalar e manter manta térmica ativa com ar aquecido forçado.",
          "Aquecer todos os fluidos intravenosos e hemocomponentes infundidos com dispositivos adequados.",
          "Monitorar temperatura corporal central continuamente (alvo > 35,5 °C)."
        ],
        resultadosEsperados: "Temperatura corporal preservada, prevenindo coagulopatia induzida pelo trauma."
      },
      {
        titulo: "Eliminação urinária prejudicada / Risco de lesão do trato urinário",
        evidenciadoPor: "Presença de uretrorragia e hematoma perineal em vigência de fratura de bacia.",
        intervencoes: [
          "Suspender qualquer tentativa de sondagem vesical às cegas.",
          "Comunicar imediatamente a urologia e equipe cirúrgica.",
          "Monitorar distensão vesical palpável e preparar material cirúrgico estéril para eventual cistostomia."
        ],
        resultadosEsperados: "Preservação da integridade uretral e drenagem urinária segura estabelecida."
      },
      {
        titulo: "Dor aguda e Ansiedade",
        evidenciadoPor: "Relato verbal de dor intensa em pelve, agitação e taquipneia.",
        intervencoes: [
          "Administrar analgesia conforme prescrição médica e reavaliar escores de dor.",
          "Manter estabilização mecânica da bacia para evitar atrito ósseo.",
          "Fornecer escuta ativa, ambiente tranquilo e explicar todas as condutas com clareza."
        ],
        resultadosEsperados: "Redução dos escores de dor e maior tranquilidade do paciente."
      }
    ],

    complicacoesTardias: {
      titulo: "Complicações Tardias a Monitorar em Fratura Pélvica Grave",
      apoio: "Evidência: Saleh et al., Cureus, 2024",
      itens: [
        { nome: "Tromboembolismo Venoso (TEV / TEP)", desc: "Alto risco de trombose venosa profunda e embolia pulmonar decorrentes do trauma pélvico, estase vascular e lesão endotelial." },
        { nome: "Necrose Avascular da Cabeça Femoral", desc: "Isquemia óssea decorrente do comprometimento dos ramos vasculares ilíacos circunflexos durante a fratura e deslocamento." },
        { nome: "Infecção do Sítio Cirúrgico e Hematoma", desc: "Grandes hematomas retroperitoneais colonizados por translocação bacteriana ou procedimentos invasivos inadvertidos." }
      ]
    }
  },

  // -------------------------------------------------------------
  // CONSULTA RÁPIDA (MODAL ACESSÍVEL EM QUALQUER TELA)
  // -------------------------------------------------------------
  consultaRapida: {
    glossario: [
      { termo: "Pré-carga", desc: "Volume de sangue que chega ao ventrículo no final da diástole; no choque hipovolêmico, está severamente reduzido." },
      { termo: "Débito Cardíaco (DC)", desc: "Volume de sangue ejetado pelo coração por minuto (DC = Frequência Cardíaca × Volume Sistólico)." },
      { termo: "Taquicardia Compensatória", desc: "Aceleração dos batimentos para tentar manter o débito cardíaco quando o volume sistólico cai." },
      { termo: "Vasoconstrição Periférica", desc: "Estreitamento das artérias da pele e vísceras para direcionar o fluxo aos órgãos nobres (coração e cérebro)." },
      { termo: "Hipoperfusão Celular", desc: "Fluxo sanguíneo insuficiente para entregar oxigênio e nutrientes e remover escórias metabólicas das células." },
      { termo: "Lactato Sérico", desc: "Subproduto do metabolismo anaeróbio; marcador laboratorial sensível de choque e hipoxemia tecidual." },
      { termo: "Acidose Metabólica", desc: "Queda do pH sanguíneo provocada pelo acúmulo de íons H⁺ e lactato, prejudicando a contratilidade cardíaca." },
      { termo: "Coagulopatia do Trauma", desc: "Incapacidade de o sangue formar coágulos eficazes, causada por consumo de fatores, diluição, acidose e frio." },
      { termo: "Tríade Letal", desc: "Círculo vicioso entre Hipotermia + Acidose + Coagulopatia que precipita desfechos fatais no trauma." },
      { termo: "FAST / eFAST", desc: "Focused Assessment with Sonography for Trauma; ultrassom direcionado para detectar líquido livre (não detecta retroperitônio)." },
      { termo: "Retroperitônio", desc: "Espaço anatômico posterior à cavidade peritoneal onde se alojam grandes plexos venosos e ramos das artérias ilíacas." },
      { termo: "Cinta Pélvica", desc: "Dispositivo de compressão circunferencial externa aplicado nos grandes trocânteres femorais para fechar o volume da pelve." },
      { termo: "Hipotensão Permissiva", desc: "// TODO: validar definição e metas sistólicas exatas (PHTLS/bibliografia da disciplina) — manutenção temporária de PAS limítrofe para não romper coágulos antes da hemostasia." },
      { termo: "XABCDE", desc: "Mnemônico sistemático de atendimento ao trauma: X (Hemorragia exsanguinante), A (Via aérea), B (Boa ventilação), C (Circulação), D (Neurológico), E (Exposição/Aquecimento)." },
      { termo: "SBAR", desc: "Técnica estruturada de passagem de caso: Situação, Breve histórico, Avaliação e Recomendação." },
      { termo: "Dupla Checagem", desc: "Conferência independente e simultânea por dois profissionais à beira do leito antes de administrar hemocomponentes ou medicações de alta vigilância." },
      { termo: "Balanço Hídrico", desc: "Controle milimétrico da relação entre volume infundido e volume eliminado (diurese, drenos, perdas)." }
    ],

    classesHemorragia: {
      nota: "Valores didáticos para adulto jovem de aproximadamente 70 kg. A resposta clínica real varia conforme idade, medicações, comorbidades e preparo físico. A ausência de taquicardia não exclui choque! // TODO: validar tabela com a bibliografia adotada pela disciplina.",
      tabela: [
        { classe: "Classe I", perda: "Até 15% (~750 mL)", fc: "< 100 bpm", pa: "Normal", fr: "14 a 20 irpm", mental: "Pouco ansioso / normal" },
        { classe: "Classe II", perda: "15% a 30% (750 a 1500 mL)", fc: "100 a 120 bpm", pa: "Normal", fr: "20 a 30 irpm", mental: "Ansioso / inquieto" },
        { classe: "Classe III", perda: "30% a 40% (1500 a 2000 mL)", fc: "120 a 140 bpm", pa: "Diminuída", fr: "30 a 40 irpm", mental: "Ansioso / confuso" },
        { classe: "Classe IV", perda: "Acima de 40% (> 2000 mL)", fc: "> 140 bpm", pa: "Muito diminuída", fr: "> 35 irpm", mental: "Confuso / letárgico" }
      ]
    }
  },

  // -------------------------------------------------------------
  // SEÇÃO FINAL: EQUIPE, PROFESSORA, REFERÊNCIAS E AVISO
  // -------------------------------------------------------------
  equipe: {
    orientadora: {
      nome: "Paula Silveira",
      titulacao: "Profa. Orientadora",
      disciplina: "Patologia Geral", // TODO: validar nome da disciplina
      foto: "assets/equipe/paula-silveira.jpg",
      iniciais: "PS"
    },
    integrantes: [
      { id: 1, nome: "Frederico Teixeira", curso: "Enfermagem, 4º período", foto: "assets/equipe/frederico-teixeira.jpg", iniciais: "FT" },
      { id: 2, nome: "Raphael Rodrigues da Silva", curso: "Enfermagem, 4º período", foto: "assets/equipe/raphael-rodrigues.jpg", iniciais: "RR" },
      { id: 3, nome: "Ianca Marques", curso: "Enfermagem, 4º período", foto: "assets/equipe/ianca-marques.jpg", iniciais: "IM" },
      { id: 4, nome: "Elisama Siqueira", curso: "Enfermagem, 4º período", foto: "assets/equipe/elisama-siqueira.jpg", iniciais: "ES" },
      { id: 5, nome: "Isabella Mendes", curso: "Enfermagem, 4º período", foto: "assets/equipe/isabella-mendes.jpg", iniciais: "IM" },
      { id: 6, nome: "Thais Prates", curso: "Enfermagem, 4º período", foto: "assets/equipe/thais-prates.jpg", iniciais: "TP" },
      { id: 7, nome: "Luiz Henrique", curso: "Enfermagem, 4º período", foto: "assets/equipe/luiz-henrique.jpg", iniciais: "LH" }
    ]
  },

  referencias: [
    {
      tipo: "Artigo de Apoio Complementar",
      citacao: "SALEH, Mohamad H.; ELASHMAWY, Ahmed; HAZIME, Munna; WALLACE, Brandon; SAAD, Mohamed A. Comprehensive orthopedic management of an open-book pelvic fracture: a multidisciplinary approach in trauma care. Cureus, v. 16, n. 7, e63669, 2 jul. 2024. DOI: 10.7759/cureus.63669. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC11293434/. Acesso em: 6 out. 2026."
    },
    {
      tipo: "Diretriz Pré-Hospitalar (Trauma)",
      citacao: "PHTLS: Prehospital Trauma Life Support. // TODO: preencher título completo, edição, local, editora e ano adotados pela disciplina."
    },
    {
      tipo: "Diretriz Cardiológica Internacional",
      citacao: "AMERICAN HEART ASSOCIATION (AHA). // TODO: preencher diretriz específica de ressuscitação e suporte circulatório, edição e ano."
    },
    {
      tipo: "Diretriz Cardiológica Nacional",
      citacao: "SOCIEDADE BRASILEIRA DE CARDIOLOGIA (SBC). // TODO: preencher diretriz de choque e monitorização hemodinâmica, volume e ano."
    },
    {
      tipo: "Bibliografia da Disciplina",
      citacao: "BIBLIOGRAFIA DE ENFERMAGEM DA DISCIPLINA. // TODO: preencher autor, título, edição, local, editora e ano conforme plano de ensino da Profa. Paula Silveira."
    },
    {
      tipo: "Classificação de Diagnósticos de Enfermagem",
      citacao: "NANDA INTERNATIONAL. Diagnósticos de enfermagem da NANDA-I: definições e classificação. // TODO: preencher edição oficial adotada pela FAC, local, editora e ano."
    }
  ],

  avisoAcademico: "Este site foi criado exclusivamente para fins acadêmicos e educacionais, como parte de trabalho do curso de Enfermagem (4º período) da FAC — Faculdade Arquidiocesana de Curvelo, na disciplina Patologia Geral, sob orientação da Profa. Paula Silveira, para o seminário 'Tipos de Choque' (20/10/2026). Não substitui avaliação profissional, protocolos institucionais ou treinamento formal em saúde."
};

// Suporte tanto para ES Modules quanto para inclusão direta por tag <script>
if (typeof window !== "undefined") {
  window.CLINICAL_DATA = CLINICAL_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = CLINICAL_DATA;
}
