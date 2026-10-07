(function(){
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
  // TRILHA DE APRENDIZADO: 6 PARADAS TEÓRICAS (MINIMALISTA)
  // -------------------------------------------------------------
  trilha: [
    {
      id: 1,
      numero: 1,
      titulo: "O que é Choque Hipovolêmico?",
      subtitulo: "Conceito hemodinâmico direto",
      icone: "heart-pulse",
      conteudo: [
        "Emergência crítica provocada pela <strong>perda rápida de volume circulante</strong> (sangue ou fluidos corporais).",
        "Menos sangue nos vasos reduz a <strong>pré-carga</strong> e o coração bombeia menos a cada batimento.",
        "O resultado é a <strong>hipoperfusão tecidual</strong>: as células deixam de receber oxigênio suficiente."
      ],
      interacao: {
        tipo: "vaso-volume",
        instrucao: "Mova o slider para alterar o volume e veja o ritmo cardíaco responder:",
        nivelInicial: 100,
        mensagensNivel: {
          alto: "Volume normal (100%–85%): Bomba cardíaca ritmada e tecidos bem oxigenados.",
          medio: "Perda moderada (84%–65%): Taquicardia compensatória para tentar manter o débito.",
          critico: "Perda crítica (< 65%): Coração bate rápido e 'vazio'. Sofrimento celular instalado!"
        }
      },
      paraFixar: "Menos volume → menos sangue voltando → menos bombeamento → células sem oxigênio."
    },

    {
      id: 2,
      numero: 2,
      titulo: "De onde vem a perda?",
      subtitulo: "Causas hemorrágicas vs. não hemorrágicas",
      icone: "droplet",
      conteudo: [
        "A perda pode ser <strong>visível ou oculta</strong> (sangramento) ou por <strong>desidratação grave</strong> (fluidos/plasma).",
        "Identificar a causa orienta a reposição imediata da enfermagem."
      ],
      gruposFlip: [
        {
          grupo: "Hemorrágico",
          subtitulo: "Perda de sangue total (glóbulos + plasma)",
          exemplos: [
            "Trauma físico (fraturas de pelve e ossos longos)",
            "Hemorragia digestiva alta ou baixa",
            "Causas obstétricas e ruptura de aneurismas"
          ],
          destaque: "Risco rápido de perda carreadora de O₂ e coagulopatia."
        },
        {
          grupo: "Não Hemorrágico",
          subtitulo: "Perda de água, eletrólitos e plasma",
          exemplos: [
            "Vômitos e diarreias graves e prolongadas",
            "Grandes queimaduras (perda maciça de plasma)",
            "Perda para o 3º espaço (pancreatite, obstrução)"
          ],
          destaque: "Provoca hemoconcentração e desidratação grave."
        }
      ],
      minijogo: {
        tipo: "classificacao",
        titulo: "Classifique a causa",
        instrucao: "Toque em cada situação clínica para classificar o tipo de perda:",
        cartas: [
          { id: "c1", texto: "Fratura fechada de pelve instável", tipo: "hemorragica", feedback: "Correto! A bacia pode ocultar mais de 2 litros de sangue no retroperitônio." },
          { id: "c2", texto: "Diarreia e vômitos intensos por 3 dias", tipo: "nao_hemorragica", feedback: "Exato! Perda gastrointestinal de água e eletrólitos." },
          { id: "c3", texto: "Grande queimadura de 2º e 3º grau", tipo: "nao_hemorragica", feedback: "Certo! Extravasamento de plasma por lesão endotelial." },
          { id: "c4", texto: "Hemorragia digestiva por varizes", tipo: "hemorragica", feedback: "Correto! Perda ativa de sangue intravascular." },
          { id: "c5", texto: "Pancreatite aguda grave", tipo: "nao_hemorragica", feedback: "Muito bem! Sequestro inflamatório no 3º espaço retroperitoneal." },
          { id: "c6", texto: "Fratura exposta de fêmur", tipo: "hemorragica", feedback: "Exato! Perda considerável de sangue e hemostasia urgente." }
        ]
      },
      paraFixar: "Perda de sangue ou de fluidos: no fim, falta volume circulante no leito vascular."
    },

    {
      id: 3,
      numero: 3,
      titulo: "A Reação em Cadeia",
      subtitulo: "Fisiopatologia: da defesa ao colapso",
      icone: "activity",
      conteudo: [
        "O corpo tenta se defender acionando o sistema simpático e hormonal para poupar cérebro e coração.",
        "Quando a compensação falha, instala-se acidose e a perigosa Tríade Letal."
      ],
      fases: [
        {
          etapa: 1,
          nome: "Queda de Pré-carga e Débito",
          detalhe: "↓ Volume circulante → ↓ Retorno venoso → ↓ Débito cardíaco e pressão arterial.",
          orgaos: ["vasos", "coracao"],
          compensacaoBarra: 100
        },
        {
          etapa: 2,
          nome: "Fase Compensada (Defesa)",
          detalhe: "Taquicardia compensatória + vasoconstrição periférica (pele fria/pálida). Rins retêm sódio e água.",
          orgaos: ["cerebro", "coracao", "pele", "rins"],
          compensacaoBarra: 75
        },
        {
          etapa: 3,
          nome: "Metabolismo Anaeróbio",
          detalhe: "Hipoperfusão celular prolongada. Células geram energia sem oxigênio, produzindo Lactato e Acidose.",
          orgaos: ["musculos", "figado", "sangue"],
          compensacaoBarra: 40
        },
        {
          etapa: 4,
          nome: "Fase Descompensada (Tríade Letal)",
          detalhe: "Hipotermia + Acidose + Coagulopatia quebram a hemostasia e levam à falência de múltiplos órgãos.",
          orgaos: ["todos"],
          compensacaoBarra: 10
        }
      ],
      triadeLetal: {
        titulo: "Tríade Letal do Trauma",
        componentes: [
          { nome: "Hipotermia", desc: "Inibe enzimas da coagulação e enfraquece o coração." },
          { nome: "Acidose", desc: "Excesso de lactato piora o tônus dos vasos e a coagulação." },
          { nome: "Coagulopatia", desc: "Sangue não coagula, intensificando o sangramento." }
        ]
      },
      paraFixar: "No começo o corpo compensa (e disfarça). Quando a defesa acaba, a queda é rápida."
    },

    {
      id: 4,
      numero: 4,
      titulo: "O Corpo Fala",
      subtitulo: "Sinais clínicos e classes de perda",
      icone: "user-check",
      conteudo: [
        "A pressão arterial sistólica cai tarde no choque. A enfermagem identifica o choque antes pela frequência cardíaca, pele e sensório."
      ],
      hotspotsCorpo: [
        {
          id: "cerebro",
          nome: "Cérebro (Sensório)",
          acontece: "Hipoperfusão cerebral e descarga de adrenalina.",
          observaEnfermeiro: "Ansiedade precoce, agitação, confusão ou sonolência tardia."
        },
        {
          id: "coracao",
          nome: "Coração (Hemodinâmica)",
          acontece: "Estímulo adrenérgico compensatório.",
          observaEnfermeiro: "Taquicardia (pulso fino e rápido). Nota: ausência de taquicardia não descarta choque em idosos ou atletas."
        },
        {
          id: "pulmoes",
          nome: "Pulmões (Ventilação)",
          acontece: "Tentativa de compensar acidose eliminando CO₂.",
          observaEnfermeiro: "Taquipneia (frequência respiratória aumentada)."
        },
        {
          id: "rins",
          nome: "Rins (Excreção)",
          acontece: "Vasoconstrição renal e ação do ADH/aldosterona.",
          observaEnfermeiro: "Oligúria (< 0,5 mL/kg/h) e urina concentrada."
        },
        {
          id: "pele",
          nome: "Pele e Perfusão",
          acontece: "Vasoconstrição periférica para poupar órgãos nobres.",
          observaEnfermeiro: "Pele pálida, fria, suor pegajoso e enchimento capilar lento (> 2s)."
        },
        {
          id: "vasos",
          nome: "Vasos e Pressão",
          acontece: "Esvaziamento do leito venoso.",
          observaEnfermeiro: "Veias colapsadas, pulso filiforme e hipotensão arterial tardia."
        }
      ],
      sliderHemorragia: {
        titulo: "As 4 Classes de Hemorragia (ATLS/PHTLS)",
        instrucao: "Deslize para ver a evolução clínica conforme o volume perdido:",
        classes: [
          {
            classe: "Classe I",
            perdaPercent: "Até 15%",
            volumeAprox: "Até 750 mL",
            fc: "< 100 bpm",
            pa: "Normal",
            fr: "14–20 irpm",
            mental: "Normal / alerta",
            resumo: "Compensado. Sintomas mínimos, similar a doar sangue.",
            faixaSlider: [0, 15]
          },
          {
            classe: "Classe II",
            perdaPercent: "15%–30%",
            volumeAprox: "750–1500 mL",
            fc: "100–120 bpm",
            pa: "Normal",
            fr: "20–30 irpm",
            mental: "Ansioso",
            resumo: "Taquicardia visível, pele fria e palidez.",
            faixaSlider: [16, 30]
          },
          {
            classe: "Classe III",
            perdaPercent: "30%–40%",
            volumeAprox: "1500–2000 mL",
            fc: "120–140 bpm",
            pa: "Diminuída",
            fr: "30–40 irpm",
            mental: "Ansioso / confuso",
            resumo: "Descompensado! Hipotensão e hipoperfusão. Precisa de sangue e controle da fonte.",
            faixaSlider: [31, 40]
          },
          {
            classe: "Classe IV",
            perdaPercent: "> 40%",
            volumeAprox: "> 2000 mL",
            fc: "> 140 bpm",
            pa: "Muito baixa",
            fr: "> 35 irpm",
            mental: "Letárgico",
            resumo: "Choque profundo com risco iminente de colapso.",
            faixaSlider: [41, 50]
          }
        ]
      },
      avisoClinico: "Atenção: A ausência de taquicardia não exclui choque (uso de betabloqueadores ou atletas).",
      paraFixar: "A pressão só cai tarde. Taquicardia, pele fria e confusão avisam antes."
    },

    {
      id: 5,
      numero: 5,
      titulo: "Montando o Quebra-Cabeça",
      subtitulo: "Diagnóstico e exames essenciais",
      icone: "clipboard-list",
      conteudo: [
        "O diagnóstico do choque é primordialmente <strong>clínico</strong>.",
        "Exames guiam a reposição e ajudam a localizar perdas ocultas."
      ],
      alertaImportante: "FAST negativo NÃO descarta hemorragia de pelve (sangramento retroperitoneal!).",
      bandejaExames: [
        {
          id: "ex_hemo",
          nome: "Hemograma Completo",
          tipo: "Laboratório",
          paraQueServe: "Avalia hemoglobina/hematócrito. Atenção: pode estar normal no início antes da hemodiluição!",
          papelEnfermagem: "Coleta com identificação positiva rigorosa e envio prioritário."
        },
        {
          id: "ex_tipagem",
          nome: "Tipagem ABO/Rh e Prova Cruzada",
          tipo: "Banco de Sangue",
          paraQueServe: "Garante compatibilidade imunológica para concentrado de hemácias e plasma.",
          papelEnfermagem: "Dupla checagem rigorosa na pulseira do paciente antes de enviar."
        },
        {
          id: "ex_lactato",
          nome: "Lactato e Gasometria",
          tipo: "Marcador de Perfusão",
          paraQueServe: "Mede sofrimento celular anaeróbio e acidose metabólica.",
          papelEnfermagem: "Coleta asséptica em seringa heparinizada com transporte ágil."
        },
        {
          id: "ex_coagulo",
          nome: "Coagulograma (TP, TTPa)",
          tipo: "Hemostasia",
          paraQueServe: "Monitora o desenvolvimento de coagulopatia precoce no trauma.",
          papelEnfermagem: "Tubo de citrato preenchido exatamente até o traço de marcação."
        },
        {
          id: "ex_fast",
          nome: "Ultrassom FAST / eFAST",
          tipo: "Imagem Beira de Leito",
          paraQueServe: "Detecta líquido livre no abdome/pericárdio. Não avalia o retroperitônio!",
          papelEnfermagem: "Posicionar aparelho e auxiliar a equipe sem mexer na pelve instável."
        },
        {
          id: "ex_tc",
          nome: "Tomografia Computadorizada",
          tipo: "Imagem Definitiva",
          paraQueServe: "Mapeamento anatômico de fraturas e vasos lesados.",
          papelEnfermagem: "JAMAIS transportar paciente hemodinamicamente instável para a TC!"
        }
      ],
      paraFixar: "Exame normal no início não descarta hemorragia. Tendência dos sinais vitais manda."
    },

    {
      id: 6,
      numero: 6,
      titulo: "Ordem de Prioridades",
      subtitulo: "Abordagem sistemática XABCDE",
      icone: "check-circle-2",
      conteudo: [
        "No trauma grave, tratamos primeiro o que mata mais rápido: a perda maciça de sangue."
      ],
      minijogoXabcde: {
        titulo: "Ordene os passos do XABCDE",
        instrucao: "Toque nos passos na sequência prioritária correta do atendimento:",
        passosCorretos: [
          { letra: "X", titulo: "Hemorragia Exsanguinante", descricao: "Conter sangramento externo e fechar pelve instável com cinta.", ordem: 1 },
          { letra: "A", titulo: "Via Aérea com Proteção Cervical", descricao: "Garantir via aérea mantendo a coluna alinhada.", ordem: 2 },
          { letra: "B", titulo: "Boa Ventilação / Oxigenação", descricao: "Checar padrão respiratório e ofertar O₂ se indicado.", ordem: 3 },
          { letra: "C", titulo: "Circulação e Reposição Criteriosa", descricao: "Acessos calibrosos, fluidos aquecidos e sangue conforme protocolo.", ordem: 4 },
          { letra: "D", titulo: "Disfunção Neurológica", descricao: "Avaliar nível de consciência e pupilas.", ordem: 5 },
          { letra: "E", titulo: "Exposição e Prevenção de Hipotermia", descricao: "Despir para inspecionar e cobrir imediatamente com manta térmica.", ordem: 6 }
        ]
      },
      paraFixar: "Primeiro o que mata mais rápido: o sangramento. Depois via aérea, circulação e calor."
    }
  ],

  // -------------------------------------------------------------
  // CASO CLÍNICO: LUCAS (28a) — EDIÇÃO ENXUTA E MINIMALISTA
  // -------------------------------------------------------------
  casoClinico: {
    pacienteInfo: {
      nome: "Lucas",
      idade: "28 anos",
      historia: "Colisão moto × automóvel em alta velocidade.",
      exameFisicoInicial: "Consciente, ansioso, pálido e com dor pélvica intensa. Perna direita encurtada e rodada para fora ('livro aberto'). Hematoma em flanco e períneo."
    },

    etapas: [
      {
        id: 1,
        numero: 1,
        fase: "FASE 1 — ATENDIMENTO PRÉ-HOSPITALAR",
        titulo: "Na Cena do Acidente",
        cenario: "rua",
        situacao: "Lucas está caído no asfalto, pálido e com dor intensa na pelve deformada. FC 128 bpm, PA 88/53 mmHg, FR 26 irpm, SpO₂ 94%.",
        contexto: "A pelve fraturada pode reter litros de sangue de forma oculta no retroperitônio. O corpo tenta compensar com taquicardia e palidez. A prioridade imediata é conter o sangramento e aquecer.",
        sinais: [
          "FC 128 bpm | PA 88/53 mmHg",
          "Pele fria, pálida e sudorese (enchimento 4s)",
          "Deformidade pélvica em rotação externa e hematomas"
        ],
        miniAnimacao: "cinta-pelvica",
        miniAnimacaoTitulo: "Estabilização Pélvica Precoce",
        miniAnimacaoDesc: "A cinta reduz o volume ósseo da pelve e promove tamponamento mecânico dos vasos.",
        opcoes: [
          {
            id: "1A",
            texto: "Seguir o XABCDE: estabilizar a pelve com cinta nos trocânteres maiores, aquecer com manta térmica, monitorizar e preparar saída rápida da cena.",
            tipo: "correta",
            pontos: 2,
            feedback: "Conduta perfeita! Conter o foco de sangramento na bacia e aquecer com manta previne o colapso precoce.",
            efeitos: { fc: -6, pas: 6, fr: -2, spo2: 3, perfusao: 5, consciencia: 0, volume: 0, temperatura: 5, sangramento: -25 },
            dicaGota: "Prioridade do XABCDE: contenha o sangramento pélvico e aqueça logo o paciente!"
          },
          {
            id: "1B",
            texto: "Fazer imobilização completa e demorada com prancha longa e colar cervical antes de cuidar da pelve.",
            tipo: "parcial",
            pontos: 1,
            feedback: "Atenção ao tempo de cena: imobilizar é importante, mas demorar sem tratar a hemorragia pélvica agrava o choque.",
            efeitos: { fc: 4, pas: -2, fr: 1, spo2: 0, perfusao: -3, consciencia: -3, volume: -5, temperatura: -5, sangramento: 0 },
            dicaGota: "Não gaste tempo precioso na via pública para procedimentos secundários."
          },
          {
            id: "1C",
            texto: "Examinar repetidamente a estabilidade comprimindo e balançando a pelve para testar mobilidade.",
            tipo: "errada",
            pontos: 0,
            feedback: "Perigoso! Balançar pelve suspeita desfaz coágulos e pode romper vasos ilíacos. Pelve suspeita não se balança: se estabiliza!",
            efeitos: { fc: 10, pas: -8, fr: 2, spo2: -2, perfusao: -8, consciencia: -5, volume: -10, temperatura: -5, sangramento: 15 },
            dicaGota: "Nunca comprima ou balance uma bacia com suspeita de fratura!"
          }
        ],
        cuidadosEnfermagem: [
          "Avaliação rápida sistemática XABCDE e alinhamento cervical.",
          "Instalação da cinta pélvica posicionada sobre os trocânteres maiores.",
          "Manta térmica para prevenir hipotermia e monitorização contínua."
        ],
        paraFixar: "Choque no trauma = procurar e conter o sangramento. Pelve suspeita se estabiliza, nunca se balança.",
        vocesabia: "A bacia fraturada pode reter mais de 2 litros de sangue sem nenhuma ferida externa aberta!"
      },

      {
        id: 2,
        numero: 2,
        fase: "FASE 1 — ATENDIMENTO PRÉ-HOSPITALAR",
        titulo: "No Transporte da Ambulância",
        cenario: "ambulancia",
        situacao: "Lucas está na ambulância com cinta aplicada, pulso fino (122 bpm) e PA 92/55 mmHg. O hospital básico local não tem cirurgião; o Centro de Trauma está a 14 minutos.",
        contexto: "Choque hemorrágico requer centro de trauma com cirurgia e banco de sangue. Atrasar o trajeto ou infundir litros de soro frio dilui fatores de coagulação e resfria o paciente.",
        sinais: [
          "PA 92/55 mmHg | FC 122 bpm",
          "Pele fria e pulsos radiais débeis",
          "Consciência oscilando entre ansiedade e torpor"
        ],
        miniAnimacao: "triade-letal",
        miniAnimacaoTitulo: "Prevenção da Tríade Letal",
        miniAnimacaoDesc: "Hipotermia + Acidose + Coagulopatia criam um ciclo vicioso fatal no trauma.",
        opcoes: [
          {
            id: "2A",
            texto: "Transporte rápido ao Centro de Trauma, acesso venoso calibroso durante o trajeto com fluidos aquecidos criteriosos e pré-notificar a Sala Vermelha via regulação.",
            tipo: "correta",
            pontos: 2,
            feedback: "Excelente decisão! O paciente certo deve ir para o hospital certo, rápido e com a equipe avisada.",
            efeitos: { fc: -4, pas: 6, fr: -1, spo2: 1, perfusao: 5, consciencia: 3, volume: 5, temperatura: 5, sangramento: -10 },
            dicaGota: "Leve direto ao hospital com cirurgia e pré-notifique a equipe!"
          },
          {
            id: "2B",
            texto: "Parar a ambulância na cena tentando punções repetidas e procedimentos secundários antes de deslocar.",
            tipo: "parcial",
            pontos: 1,
            feedback: "Acesso venoso no trauma grave deve ser feito em deslocamento. Permanecer parado consome tempo vital.",
            efeitos: { fc: 4, pas: -3, fr: 0, spo2: 0, perfusao: -4, consciencia: -3, volume: -6, temperatura: -6, sangramento: 5 },
            dicaGota: "A hora de ouro não permite ficar parado na via pública."
          },
          {
            id: "2C",
            texto: "Desviar o trajeto para o hospital básico local, que não tem suporte cirúrgico nem hemoterapia.",
            tipo: "errada",
            pontos: 0,
            feedback: "Decisão inadequada: parar onde não há cirurgia nem sangue atrasa o tratamento definitivo e exige transferência de alto risco.",
            efeitos: { fc: 8, pas: -8, fr: 1, spo2: -1, perfusao: -8, consciencia: -6, volume: -10, temperatura: -8, sangramento: 10 },
            dicaGota: "O hospital mais próximo nem sempre é o hospital capacitado para trauma pélvico."
          }
        ],
        cuidadosEnfermagem: [
          "Punção de acesso calibroso em deslocamento sem atrasar a saída.",
          "Fluidos aquecidos e criteriosos conforme prescrição/protocolo.",
          "Pré-notificação imediata do Centro de Trauma pela regulação."
        ],
        paraFixar: "No trauma grave, o paciente vai para o hospital certo, rápido e com a equipe avisada.",
        vocesabia: "Cristaloide em excesso dilui os fatores de coagulação e aumenta o sangramento."
      },

      {
        id: 3,
        numero: 3,
        fase: "FASE 2 — SALA VERMELHA (PS)",
        titulo: "Chegada à Sala Vermelha",
        cenario: "sala-vermelha",
        situacao: "Lucas dá entrada na Sala Vermelha. A PA sobe brevemente e cai para 84/50 mmHg (resposta transitória). Ultrassom FAST é negativo no abdome, mas o lactato é 4,8 mmol/L.",
        contexto: "FAST negativo NÃO descarta sangramento pélvico (o sangue se esconde no retroperitônio). O lactato alto confirma hipoperfusão tecidual severa.",
        sinais: [
          "Resposta transitória à reposição",
          "Lactato 4,8 mmol/L e acidose metabólica",
          "FAST negativo com pelve instável"
        ],
        miniAnimacao: "fast-negativo",
        miniAnimacaoTitulo: "Atenção ao Retroperitônio",
        miniAnimacaoDesc: "O FAST avalia a cavidade peritoneal; o sangramento pélvico fica atrás (retroperitônio).",
        opcoes: [
          {
            id: "3A",
            texto: "Passagem de caso (SBAR), manter cinta pélvica, 2 acessos calibrosos, coletar exames com identificação rigorosa, aquecer ativamente, acionar transfusão maciça e acionar cirurgia/ortopedia.",
            tipo: "correta",
            pontos: 2,
            feedback: "Conduta exemplar! Choque grave exige hemostasia e sangue. A enfermagem garante os acessos, a segurança nas amostras e o calor.",
            efeitos: { fc: -8, pas: 8, fr: -1, spo2: 2, perfusao: 10, consciencia: 5, volume: 15, temperatura: 5, sangramento: -25 },
            dicaGota: "FAST negativo na pelve não descarta choque! Foque em amostras corretas e sangue."
          },
          {
            id: "3B",
            texto: "Interpretar o FAST negativo como ausência de sangramento, infundir apenas soro e aguardar tomografia.",
            tipo: "parcial",
            pontos: 1,
            feedback: "Equívoco perigoso: FAST negativo exclui hemoperitônio, não hematoma retroperitoneal. Continuar apenas com soro esfria o paciente.",
            efeitos: { fc: 2, pas: -4, fr: 0, spo2: 0, perfusao: -5, consciencia: -3, volume: -3, temperatura: -8, sangramento: 5 },
            dicaGota: "Cristaloide puro não transporta oxigênio e piora a hipotermia."
          },
          {
            id: "3C",
            texto: "Afrouxar a cinta para palpar a pelve e levar o paciente instável imediatamente para a tomografia.",
            tipo: "errada",
            pontos: 0,
            feedback: "Conduta fatal: soltar a cinta desfaz o tamponamento e reabre o sangramento. Paciente instável nunca vai para a TC!",
            efeitos: { fc: 10, pas: -12, fr: 1, spo2: -3, perfusao: -10, consciencia: -8, volume: -12, temperatura: -4, sangramento: 20 },
            dicaGota: "Nunca remova a cinta e jamais leve paciente instável para a tomografia!"
          }
        ],
        cuidadosEnfermagem: [
          "Passagem estruturada de caso com SBAR e monitorização contínua.",
          "Manutenção e checagem da cinta pélvica sem afrouxamento indevido.",
          "Aquecimento ativo precoce e coleta de amostras com checagem rigorosa."
        ],
        paraFixar: "FAST negativo não descarta sangramento pélvico. Instável precisa de sangue e hemostasia, não tomografia.",
        vocesabia: "Em estudo publicado (Saleh et al., Cureus, 2024), paciente com fratura em livro aberto apresentou FC de 76 bpm: ausência de taquicardia não exclui choque!"
      },

      {
        id: 4,
        numero: 4,
        fase: "FASE 2 — SALA VERMELHA (PS)",
        titulo: "Transfusão com Segurança",
        cenario: "sala-vermelha",
        situacao: "Chegou o primeiro concentrado de hemácias do Banco de Sangue. A equipe está com pressa. Cabe à enfermagem instalar e vigiar a infusão.",
        contexto: "Na urgência, a transfusão salva vidas, mas falhas de identificação provocam reações hemolíticas agudas fatais. Vigilância nos primeiros 15 minutos é obrigatória.",
        sinais: [
          "Instalação de hemocomponente sob pressão de tempo",
          "Risco de reação por erro de identificação",
          "Sinais de alerta: calafrios, febre, dor lombar ou queda de PA"
        ],
        miniAnimacao: "transfusao-segura",
        miniAnimacaoTitulo: "Cultura de Segurança Transfusional",
        miniAnimacaoDesc: "Dupla checagem obrigatória: conferência independente da pulseira e da bolsa à beira do leito.",
        opcoes: [
          {
            id: "4A",
            texto: "Conferir prescrição, realizar dupla checagem à beira do leito (paciente e bolsa), aferir sinais vitais antes de abrir, usar equipo com filtro e observar diretamente nos primeiros 15 minutos.",
            tipo: "correta",
            pontos: 2,
            feedback: "Brilhante! A pressa da emergência nunca pode suprimir a dupla checagem. A vigilância precoce detecta incompatibilidades a tempo.",
            efeitos: { fc: -4, pas: 6, fr: -1, spo2: 2, perfusao: 5, consciencia: 3, volume: 8, temperatura: 3, sangramento: 0 },
            dicaGota: "Segurança em primeiro lugar: dupla checagem e vigilância no leito salvam vidas."
          },
          {
            id: "4B",
            texto: "Fazer a checagem correta antes de conectar a bolsa, mas sair do leito logo em seguida sem reavaliar os primeiros minutos.",
            tipo: "parcial",
            pontos: 1,
            feedback: "A checagem inicial foi certa, mas abandonar a vigilância impede de reconhecer uma reação hemolítica no início.",
            efeitos: { fc: 2, pas: 0, fr: 0, spo2: 0, perfusao: -2, consciencia: -1, volume: 2, temperatura: 0, sangramento: 0 },
            dicaGota: "A maioria das reações transfusionais graves ocorre nos primeiros 15 minutos!"
          },
          {
            id: "4C",
            texto: "Conectar a bolsa rapidamente conferindo apenas a etiqueta sozinho(a), pulando a pulseira para 'ganhar tempo'.",
            tipo: "errada",
            pontos: 0,
            feedback: "Erro gravíssimo! Incompatibilidade ABO por falha de identificação causa choque hemolítico e coagulação intravascular disseminada.",
            efeitos: { fc: 8, pas: -10, fr: 3, spo2: -3, perfusao: -10, consciencia: -6, volume: -5, temperatura: 0, sangramento: 0 },
            dicaGota: "Nunca pule a dupla checagem à beira do leito!"
          }
        ],
        cuidadosEnfermagem: [
          "Dupla checagem obrigatória à beira do leito com conferência da pulseira.",
          "Aferição de sinais vitais antes, aos 10–15 minutos e ao término da infusão.",
          "Suspensão IMEDIATA da infusão caso surjam calafrios, febre ou dor."
        ],
        paraFixar: "Pressa não dispensa a dupla checagem. Na transfusão, quem vigia detecta a reação a tempo.",
        vocesabia: "Mais de 90% dos erros transfusionais graves decorrem de falhas humanas na checagem da identificação do paciente!"
      },

      {
        id: 5,
        numero: 5,
        fase: "FASE 2 — SALA VERMELHA (PS)",
        titulo: "Suspeita de Lesão Uretral",
        cenario: "sala-vermelha",
        situacao: "Lucas melhora a PA. Ao preparar o cateterismo vesical para medir a diurese, você nota sangue vivo no meato uretral e hematoma em bolsa escrotal.",
        contexto: "Fraturas de bacia podem romper a uretra. Passar sonda às cegas pode transformar uma laceração parcial em ruptura completa e infectar a pelve.",
        sinais: [
          "Sangue no meato uretral (uretrorragia)",
          "Hematoma perineal e escrotal proeminente",
          "Dor suprapúbica ou bexigoma palpável"
        ],
        miniAnimacao: "uretra",
        miniAnimacaoTitulo: "Alerta: Não Sonde às Cegas!",
        miniAnimacaoDesc: "Uretrorragia contraindica sondagem às cegas. Comunique imediatamente a urologia.",
        opcoes: [
          {
            id: "5A",
            texto: "Suspender qualquer tentativa de sondagem, comunicar imediatamente à equipe médica e urologia, registrar os achados e vigiar distensão vesical.",
            tipo: "correta",
            pontos: 2,
            feedback: "Perfeito! Reconhecer os sinais de lesão uretral protege o paciente contra sequelas definitivas. A investigação vem antes da sonda.",
            efeitos: { fc: 0, pas: 0, fr: 0, spo2: 0, perfusao: 2, consciencia: 2, volume: 0, temperatura: 0, sangramento: 0 },
            dicaGota: "Sangue no meato é sinal de pare! Jamais introduza sonda vesical às cegas."
          },
          {
            id: "5B",
            texto: "Tentar passar a sonda vesical 'com delicadeza', prometendo parar se houver resistência mecânica.",
            tipo: "parcial",
            pontos: 1,
            feedback: "Conduta arriscada: mesmo com delicadeza, o cateter pode romper a mucosa lesada e invadir o hematoma pélvico.",
            efeitos: { fc: 2, pas: -1, fr: 0, spo2: 0, perfusao: -2, consciencia: 0, volume: -3, temperatura: 0, sangramento: 3 },
            dicaGota: "A presença de sangue no meato contraindica qualquer tentativa às cegas."
          },
          {
            id: "5C",
            texto: "Passar sonda de alívio rápido para drenar a bexiga antes de avisar a equipe médica.",
            tipo: "errada",
            pontos: 0,
            feedback: "Conduta incorreta: passar sonda às cegas pode dilacerar a uretra e provocar extravasamento de urina para a pelve fraturada.",
            efeitos: { fc: 4, pas: -3, fr: 1, spo2: 0, perfusao: -4, consciencia: -2, volume: -5, temperatura: 0, sangramento: 5 },
            dicaGota: "Nunca passe sonda com sangue no meato. Comunique à equipe imediatamente!"
          }
        ],
        cuidadosEnfermagem: [
          "Inspeção visual do meato uretral e períneo antes de qualquer sondagem.",
          "Interrupção imediata do procedimento se houver uretrorragia ou hematoma perineal.",
          "Comunicação urgente com a urologia para avaliação e conduta adequada."
        ],
        paraFixar: "Sangue no meato + hematoma perineal = suspeita de lesão uretral. Não sonde às cegas: comunique.",
        vocesabia: "Lesões uretrais acometem até 15% das fraturas pélvicas graves em livro aberto (Saleh et al., Cureus, 2024)."
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

/**
 * STATE.JS — Gerenciador de estado reativo do jogo e da trilha
 * Sala Vermelha: Choque Hipovolêmico
 */

class GameState {
  constructor() {
    this.listeners = [];
    this.storageKey = "sala_vermelha_pref_v1";

    // Configurações padrão e preferências salvas
    this.prefs = this.loadPreferences();

    // Estado geral
    this.nomeJogador = this.prefs.nomeJogador || "";
    this.trilhaConcluida = new Set(this.prefs.trilhaConcluida || []);
    
    // Estado do Caso Clínico
    this.etapaAtualIndex = 0; // 0 a 4 (5 etapas)
    this.pontos = 0;
    this.dicasRestantes = 2;
    this.dicasUsadas = 0;
    this.historicoEscolhas = []; // [{ etapa, opcaoId, tipo, pontos, deltas }]
    this.cintaPelvicaAplicada = false;
    this.mantaTermicaAplicada = false;
    this.transfusaoIniciada = false;

    // Estado do Paciente Lucas
    this.paciente = this.getInitialPatientState();
    this.pacienteAnterior = { ...this.paciente };

    // Finais e status
    this.jogoFinalizado = false;
    this.resultadoFinal = null; // { finalId, titulo, estrelas, ... }
  }

  getClinicalData() {
    if (typeof window !== "undefined" && window.CLINICAL_DATA) return window.CLINICAL_DATA;
    if (typeof globalThis !== "undefined" && globalThis.CLINICAL_DATA) return globalThis.CLINICAL_DATA;
    return null;
  }

  getInitialPatientState() {
    const data = this.getClinicalData();
    const init = data?.paciente?.estadoInicial || {
      fc: 128,
      pas: 88,
      fr: 26,
      spo2: 94,
      perfusao: 40,
      consciencia: 85,
      volume: 55,
      temperatura: 75,
      sangramento: 70
    };
    return { ...init };
  }

  // Clamping seguro nos intervalos clínicos definidos
  clamp(valor, min, max) {
    return Math.max(min, Math.min(max, Math.round(valor)));
  }

  // Aplica deltas das escolhas com regras de hemostasia e aquecimento
  aplicarEfeitos(deltas, opcaoId) {
    this.pacienteAnterior = { ...this.paciente };

    // Se a etapa 1 selecionou a conduta da cinta pélvica
    if (opcaoId === "1A") this.cintaPelvicaAplicada = true;
    if (opcaoId === "1C") this.cintaPelvicaAplicada = false;
    if (opcaoId === "1A" || opcaoId === "2A" || opcaoId === "3A") this.mantaTermicaAplicada = true;
    if (opcaoId === "3A" || opcaoId === "4A") this.transfusaoIniciada = true;

    this.paciente.fc = this.clamp(this.paciente.fc + (deltas.fc || 0), 40, 180);
    this.paciente.pas = this.clamp(this.paciente.pas + (deltas.pas || 0), 40, 140);
    this.paciente.fr = this.clamp(this.paciente.fr + (deltas.fr || 0), 8, 40);
    this.paciente.spo2 = this.clamp(this.paciente.spo2 + (deltas.spo2 || 0), 70, 100);
    this.paciente.perfusao = this.clamp(this.paciente.perfusao + (deltas.perfusao || 0), 0, 100);
    this.paciente.consciencia = this.clamp(this.paciente.consciencia + (deltas.consciencia || 0), 0, 100);
    this.paciente.volume = this.clamp(this.paciente.volume + (deltas.volume || 0), 0, 100);
    this.paciente.temperatura = this.clamp(this.paciente.temperatura + (deltas.temperatura || 0), 0, 100);
    this.paciente.sangramento = this.clamp(this.paciente.sangramento + (deltas.sangramento || 0), 0, 100);

    this.notify();
  }

  // PA Diastólica calculada didaticamente
  get pad() {
    return Math.round(this.paciente.pas * 0.6);
  }

  // Registra a escolha da etapa e computa pontos
  registrarEscolha(etapaIndex, opcao) {
    const pontosGanhos = opcao.pontos ?? (opcao.tipo === "correta" ? 2 : opcao.tipo === "parcial" ? 1 : 0);
    this.pontos += pontosGanhos;

    const registro = {
      etapaIndex,
      opcaoId: opcao.id,
      tipo: opcao.tipo,
      pontos: pontosGanhos,
      deltas: opcao.efeitos,
      estadoAntes: { ...this.pacienteAnterior },
      estadoDepois: { ...this.paciente }
    };

    this.historicoEscolhas.push(registro);
    this.notify();
    return registro;
  }

  // Uso de dica da Gota (máximo 2 por partida)
  usarDica() {
    if (this.dicasRestantes > 0) {
      this.dicasRestantes--;
      this.dicasUsadas++;
      this.notify();
      return true;
    }
    return false;
  }

  // Cálculo rigoroso do Final do Caso (avaliado na ordem exata da Seção 6.2)
  calcularFinal() {
    const data = this.getClinicalData();
    const limiares = data?.paciente?.limiaresFinais || {
      final3: { pontosMax: 3, volumeMin: 30, perfusaoMin: 20 },
      final1: { pontosMin: 8, volumeMin: 70, perfusaoMin: 55, sangramentoMax: 40 }
    };
    const finaisData = data?.finais || {};

    let finalChave = "final2";
    let estrelasBase = 2;

    // Regra 1: Final 3 (Evolução desfavorável)
    if (
      this.pontos <= limiares.final3.pontosMax ||
      this.paciente.volume < limiares.final3.volumeMin ||
      this.paciente.perfusao < limiares.final3.perfusaoMin
    ) {
      finalChave = "final3";
      estrelasBase = 1;
    }
    // Regra 2: Final 1 (Estabilizado)
    else if (
      this.pontos >= limiares.final1.pontosMin &&
      this.paciente.volume >= limiares.final1.volumeMin &&
      this.paciente.perfusao >= limiares.final1.perfusaoMin &&
      this.paciente.sangramento <= limiares.final1.sangramentoMax
    ) {
      finalChave = "final1";
      estrelasBase = 3;
    }
    // Regra 3: Final 2 (Grave, porém vivo)
    else {
      finalChave = "final2";
      estrelasBase = 2;
    }

    // Cálculo das estrelas com penalidade de dicas usadas (desconta no máximo 1 estrela)
    let estrelasFinais = estrelasBase;
    if (this.dicasUsadas > 0 && estrelasFinais > 1) {
      estrelasFinais -= 1;
    }

    this.jogoFinalizado = true;
    this.resultadoFinal = {
      ...finaisData[finalChave],
      chave: finalChave,
      estrelas: estrelasFinais,
      estrelasBase,
      pontos: this.pontos,
      maxPontos: 10,
      dicasUsadas: this.dicasUsadas,
      paciente: { ...this.paciente }
    };

    // Salvar melhor resultado
    this.saveBestResult(this.resultadoFinal);
    this.notify();
    return this.resultadoFinal;
  }

  // Reiniciar partida do Caso Clínico
  reiniciarCaso() {
    this.etapaAtualIndex = 0;
    this.pontos = 0;
    this.dicasRestantes = 2;
    this.dicasUsadas = 0;
    this.historicoEscolhas = [];
    this.cintaPelvicaAplicada = false;
    this.mantaTermicaAplicada = false;
    this.transfusaoIniciada = false;
    this.jogoFinalizado = false;
    this.resultadoFinal = null;
    this.paciente = this.getInitialPatientState();
    this.pacienteAnterior = { ...this.paciente };
    this.notify();
  }

  // Marcar parada teórica como concluída
  concluirParadaTrilha(paradaId) {
    this.trilhaConcluida.add(paradaId);
    this.savePreferences();
    this.notify();
  }

  isParadaConcluida(paradaId) {
    return this.trilhaConcluida.has(paradaId);
  }

  // Embaralhar opções sem alterar id (Fisher-Yates)
  embaralharOpcoes(opcoes) {
    const copias = [...opcoes];
    for (let i = copias.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copias[i], copias[j]] = [copias[j], copias[i]];
    }
    return copias;
  }

  // Sistema de Observadores / Reatividade
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this);
      } catch (err) {
        console.error("Erro no listener de estado:", err);
      }
    });
  }

  // Persistência com tratamento seguro de localStorage
  loadPreferences() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Aviso: localStorage inacessível ou desabilitado.");
    }
    return {
      nomeJogador: "",
      somAtivo: false,
      animacoesReduzidas: false,
      modoApresentacao: false,
      trilhaConcluida: []
    };
  }

  savePreferences() {
    try {
      const data = {
        nomeJogador: this.nomeJogador,
        somAtivo: this.prefs.somAtivo,
        animacoesReduzidas: this.prefs.animacoesReduzidas,
        modoApresentacao: this.prefs.modoApresentacao,
        trilhaConcluida: Array.from(this.trilhaConcluida)
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      // Ignora falhas de gravação em modo anônimo
    }
  }

  saveBestResult(resultado) {
    try {
      const chaveMelhor = "sala_vermelha_melhor_resultado";
      const atual = JSON.parse(localStorage.getItem(chaveMelhor) || "null");
      if (!atual || resultado.pontos > atual.pontos || (resultado.pontos === atual.pontos && resultado.estrelas > atual.estrelas)) {
        localStorage.setItem(chaveMelhor, JSON.stringify({
          pontos: resultado.pontos,
          estrelas: resultado.estrelas,
          chave: resultado.chave,
          data: new Date().toLocaleDateString("pt-BR")
        }));
      }
    } catch (e) {}
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.gameState = new GameState();
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameState;
}

/**
 * PATIENT.JS — Renderizador do Paciente Lucas (SVG Cartoon Dinâmico)
 * Sala Vermelha: Choque Hipovolêmico
 */

class PatientRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  getSkinColors(perfusao) {
    if (perfusao >= 70) {
      return { start: "#FED0BB", end: "#F7A382", blush: 0.75, lip: "#E63946" };
    }
    if (perfusao >= 50) {
      return { start: "#F5DFCE", end: "#E2BAA3", blush: 0.4, lip: "#C96D6D" };
    }
    if (perfusao >= 30) {
      return { start: "#EFE8DC", end: "#D8C7B5", blush: 0.15, lip: "#A68080" };
    }
    return { start: "#E2E7EF", end: "#BAC8D8", blush: 0.05, lip: "#7E8C9D" }; // cianose suave
  }

  renderScenarioBackground(cenarioTipo) {
    if (cenarioTipo === "rua") {
      return `
        <defs>
          <linearGradient id="skyRua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E2E8F0"/>
            <stop offset="100%" stop-color="#CBD5E1"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="520" height="240" fill="url(#skyRua)"/>
        <!-- Pista e asfalto com guia -->
        <rect x="0" y="165" width="520" height="75" fill="#334155"/>
        <line x1="0" y1="202" x2="520" y2="202" stroke="#FBBF24" stroke-width="3" stroke-dasharray="24 16"/>
        <!-- Moto caída estilizada cartoon Duolingo -->
        <g transform="translate(42, 160) scale(0.68)">
          <circle cx="20" cy="28" r="14" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
          <circle cx="20" cy="28" r="6" fill="#94A3B8"/>
          <circle cx="72" cy="28" r="14" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
          <circle cx="72" cy="28" r="6" fill="#94A3B8"/>
          <path d="M 20 28 L 44 8 L 62 22 L 72 28" stroke="#E63946" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="44" cy="8" r="5" fill="#FFD166"/>
          <line x1="44" y1="8" x2="38" y2="-2" stroke="#64748B" stroke-width="4" stroke-linecap="round"/>
        </g>
        <!-- Ambulância fofa ao fundo com giroflex pulsante -->
        <g transform="translate(390, 105) scale(0.8)">
          <rect x="10" y="24" width="105" height="56" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.5"/>
          <path d="M 78 32 L 105 32 L 115 54 L 78 54 Z" fill="#93C5FD" rx="2"/>
          <rect x="10" y="52" width="105" height="10" fill="#E63946"/>
          <rect x="42" y="32" width="6" height="16" rx="2" fill="#E63946"/>
          <rect x="37" y="37" width="16" height="6" rx="2" fill="#E63946"/>
          <circle cx="34" cy="80" r="10" fill="#1E293B"/>
          <circle cx="94" cy="80" r="10" fill="#1E293B"/>
          <!-- Sirene pulsando -->
          <ellipse cx="62" cy="20" rx="8" ry="6" fill="#EF4444" class="siren-active"/>
        </g>
      `;
    }

    if (cenarioTipo === "ambulancia") {
      return `
        <rect x="0" y="0" width="520" height="240" fill="#1E293B"/>
        <rect x="12" y="12" width="496" height="216" rx="14" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
        <!-- Janela da ambulância -->
        <rect x="36" y="28" width="150" height="64" rx="8" fill="#BAE6FD" stroke="#93C5FD" stroke-width="2"/>
        <line x1="45" y1="70" x2="175" y2="70" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="14 10"/>
        <!-- Painel de oxigênio / suporte -->
        <rect x="390" y="28" width="85" height="95" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="400" y="38" width="65" height="38" rx="4" fill="#0F172A"/>
        <line x1="405" y1="58" x2="460" y2="58" stroke="#10B981" stroke-width="2"/>
        <circle cx="412" cy="94" r="5" fill="#10B981"/>
        <circle cx="430" cy="94" r="5" fill="#EF4444"/>
      `;
    }

    // Cenário Sala Vermelha
    return `
      <rect x="0" y="0" width="520" height="240" fill="#F8FAFC"/>
      <!-- Faixa institucional Sala Vermelha com luz suave -->
      <rect x="0" y="65" width="520" height="18" fill="#E63946" opacity="0.9"/>
      <text x="24" y="78" font-family="'Fredoka', sans-serif" font-weight="700" font-size="10.5" fill="#FFFFFF" letter-spacing="2">EMERGÊNCIA • SALA VERMELHA • PLANTÃO DE TRAUMA</text>
      <!-- Sirene no teto -->
      <g transform="translate(250, 10)" class="siren-active">
        <rect x="0" y="0" width="20" height="5" fill="#64748B" rx="2"/>
        <path d="M 3 5 C 3 17, 17 17, 17 5 Z" fill="#EF4444"/>
      </g>
      <!-- Suporte de soro elegante -->
      <line x1="72" y1="26" x2="72" y2="225" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 58 36 Q 72 26 86 36" stroke="#94A3B8" stroke-width="2.5" fill="none"/>
    `;
  }

  render(state) {
    if (!this.container) return;

    const p = state.paciente;
    const skin = this.getSkinColors(p.perfusao);
    const cenarioTipo = state.etapaAtualIndex === 0 ? "rua" : state.etapaAtualIndex === 1 ? "ambulancia" : "sala-vermelha";

    // Expressão dos olhos estilo Duolingo
    let eyesSvg = "";
    if (p.consciencia >= 75) {
      // Olhos grandes, pupilas brilhantes, sobrancelhas de dor arqueadas
      eyesSvg = `
        <g transform="translate(178, 114)">
          <ellipse cx="0" cy="0" rx="5.5" ry="6.5" fill="#FFFFFF" stroke="#1D2B53" stroke-width="1.8"/>
          <ellipse cx="0.5" cy="0" rx="3.6" ry="4.5" fill="#1D2B53"/>
          <circle cx="1.8" cy="-1.5" r="1.5" fill="#FFFFFF"/>
          <circle cx="-0.8" cy="1.8" r="0.8" fill="#FFFFFF"/>
        </g>
        <g transform="translate(196, 114)">
          <ellipse cx="0" cy="0" rx="5.5" ry="6.5" fill="#FFFFFF" stroke="#1D2B53" stroke-width="1.8"/>
          <ellipse cx="0.5" cy="0" rx="3.6" ry="4.5" fill="#1D2B53"/>
          <circle cx="1.8" cy="-1.5" r="1.5" fill="#FFFFFF"/>
          <circle cx="-0.8" cy="1.8" r="0.8" fill="#FFFFFF"/>
        </g>
        <!-- Sobrancelhas de dor inclinadas -->
        <path d="M 172 105 Q 178 102 184 107" stroke="#3D261A" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M 202 105 Q 196 102 190 107" stroke="#3D261A" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      `;
    } else if (p.consciencia >= 45) {
      // Sonolento / pálpebras caídas
      eyesSvg = `
        <g transform="translate(178, 115)">
          <ellipse cx="0" cy="0" rx="5.5" ry="6" fill="#FFFFFF" stroke="#1D2B53" stroke-width="1.5"/>
          <ellipse cx="0" cy="1" rx="3.2" ry="3.5" fill="#1D2B53"/>
          <circle cx="1.2" cy="0" r="1.1" fill="#FFFFFF"/>
          <path d="M -5.5 -1 Q 0 4 5.5 -1" fill="${skin.end}" stroke="#1D2B53" stroke-width="1.6"/>
        </g>
        <g transform="translate(196, 115)">
          <ellipse cx="0" cy="0" rx="5.5" ry="6" fill="#FFFFFF" stroke="#1D2B53" stroke-width="1.5"/>
          <ellipse cx="0" cy="1" rx="3.2" ry="3.5" fill="#1D2B53"/>
          <circle cx="1.2" cy="0" r="1.1" fill="#FFFFFF"/>
          <path d="M -5.5 -1 Q 0 4 5.5 -1" fill="${skin.end}" stroke="#1D2B53" stroke-width="1.6"/>
        </g>
        <path d="M 173 107 Q 178 108 183 109" stroke="#5D3A24" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M 201 107 Q 196 108 191 109" stroke="#5D3A24" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      `;
    } else {
      // Olhos fechados / torpor
      eyesSvg = `
        <path d="M 173 116 Q 178 119 183 116" stroke="#1D2B53" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 191 116 Q 196 119 201 116" stroke="#1D2B53" stroke-width="3" stroke-linecap="round" fill="none"/>
        <line x1="174" y1="110" x2="182" y2="111" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
        <line x1="200" y1="110" x2="192" y2="111" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
      `;
    }

    // Suor dinâmico estilo cartoon
    const showSweat = p.perfusao < 55;
    const sweatSvg = showSweat ? `
      <g class="sweat-drop" fill="#60A5FA" stroke="#3B82F6" stroke-width="0.8">
        <path d="M 169 107 C 169 104 172 102 172 102 C 172 102 175 104 175 107 A 3 3 0 0 1 169 107 Z"/>
        <path d="M 202 109 C 202 106 205 104 205 104 C 205 104 208 106 208 109 A 3 3 0 0 1 202 109 Z"/>
      </g>
    ` : "";

    const isShivering = p.temperatura < 65 ? "patient-shivering" : "";

    // Hematoma pélvico difuso moderno
    const hematomaRadiusX = Math.max(10, (p.sangramento / 100) * 34);
    const hematomaRadiusY = Math.max(6, (p.sangramento / 100) * 20);
    const hematomaOpacity = Math.min(0.85, Math.max(0.2, p.sangramento / 100));

    // Cinta Pélvica moderna (estilo SAM Pelvic Sling profissional)
    const cintaSvg = state.cintaPelvicaAplicada ? `
      <g transform="translate(260, 140)">
        <!-- Faixa azul de neoprene -->
        <rect x="0" y="0" width="64" height="26" rx="6" fill="#1D2B53" stroke="#0F172A" stroke-width="2"/>
        <!-- Faixa central laranja de alta visibilidade -->
        <rect x="12" y="5" width="40" height="16" rx="3" fill="#FF6B35"/>
        <!-- Fivela / engate mecânico de tração -->
        <rect x="25" y="3" width="14" height="20" rx="3" fill="#FFD166" stroke="#D97706" stroke-width="1.5"/>
        <circle cx="32" cy="13" r="3" fill="#EF4444"/>
        <!-- Costura tracejada profissional -->
        <line x1="4" y1="3" x2="60" y2="3" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 2"/>
        <line x1="4" y1="23" x2="60" y2="23" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="32" y="34" font-family="'Nunito', sans-serif" font-weight="800" font-size="7.5" fill="#1D2B53" text-anchor="middle">SAM SLING FIXADA</text>
      </g>
    ` : "";

    // Manta térmica aluminizada reflexiva
    const mantaSvg = state.mantaTermicaAplicada ? `
      <g>
        <path d="M 194 130 Q 300 116 415 134 L 410 188 Q 295 194 194 176 Z" 
              fill="url(#mantaGrad)" opacity="0.94" stroke="#D97706" stroke-width="1.8"/>
        <!-- Vincos poligonais reflexivos de manta de trauma -->
        <line x1="220" y1="130" x2="310" y2="190" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6"/>
        <line x1="280" y1="125" x2="370" y2="185" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6"/>
        <line x1="330" y1="124" x2="405" y2="175" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6"/>
        <text x="305" y="156" font-family="'Fredoka', sans-serif" font-weight="700" font-size="10.5" fill="#78350F" text-anchor="middle" letter-spacing="1">MANTA TÉRMICA ATIVA</text>
      </g>
    ` : "";

    // Bolsas de infusão
    let infusionBagSvg = "";
    if (state.transfusaoIniciada) {
      infusionBagSvg = `
        <g transform="translate(62, 46)">
          <rect x="0" y="0" width="24" height="36" rx="6" fill="#881337" stroke="#FFFFFF" stroke-width="1.8"/>
          <rect x="4" y="6" width="16" height="13" rx="2" fill="#FFFFFF" opacity="0.95"/>
          <text x="12" y="16" font-family="'Nunito', sans-serif" font-weight="800" font-size="7.5" fill="#881337" text-anchor="middle">CH O+</text>
          <!-- Linha do equipo em curva suave -->
          <path d="M 12 36 Q 14 70 45 105" stroke="#881337" stroke-width="2" fill="none"/>
          <circle cx="12" cy="48" r="2.5" fill="#881337" class="iv-drip fast"/>
        </g>
      `;
    } else {
      infusionBagSvg = `
        <g transform="translate(62, 46)">
          <rect x="0" y="0" width="24" height="36" rx="6" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.8"/>
          <text x="12" y="20" font-family="'Nunito', sans-serif" font-weight="800" font-size="7.5" fill="#0369A1" text-anchor="middle">SF 0.9%</text>
          <path d="M 12 36 Q 14 70 45 105" stroke="#38BDF8" stroke-width="1.8" fill="none"/>
          <circle cx="12" cy="48" r="2.2" fill="#38BDF8" class="iv-drip"/>
        </g>
      `;
    }

    const html = `
      <svg viewBox="0 0 520 240" class="patient-svg-root" style="width: 100%; height: auto; display: block;">
        <defs>
          <linearGradient id="skinDuoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${skin.start}"/>
            <stop offset="100%" stop-color="${skin.end}"/>
          </linearGradient>

          <linearGradient id="hairDuoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4A3022"/>
            <stop offset="100%" stop-color="#2D1C13"/>
          </linearGradient>

          <linearGradient id="gownDuoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#CCFBF1"/>
            <stop offset="100%" stop-color="#99F6E4"/>
          </linearGradient>

          <linearGradient id="mantaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="50%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#FBBF24"/>
          </linearGradient>

          <radialGradient id="hematomaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#6B21A8" stop-opacity="0.9"/>
            <stop offset="70%" stop-color="#7E22CE" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#A855F7" stop-opacity="0"/>
          </radialGradient>

          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#0F172A" flood-opacity="0.12"/>
          </filter>
        </defs>

        <!-- 1. Cenário de Fundo -->
        ${this.renderScenarioBackground(cenarioTipo)}

        <!-- 2. Maca Hospitalar Moderna com Rodas -->
        <g transform="translate(130, 150)" filter="url(#softGlow)">
          <rect x="8" y="20" width="285" height="12" rx="5" fill="#64748B"/>
          <rect x="28" y="32" width="10" height="28" rx="2" fill="#475569"/>
          <rect x="265" y="32" width="10" height="28" rx="2" fill="#475569"/>
          <!-- Rodas com trava -->
          <circle cx="33" cy="62" r="8" fill="#1E293B"/>
          <circle cx="33" cy="62" r="3" fill="#94A3B8"/>
          <circle cx="270" cy="62" r="8" fill="#1E293B"/>
          <circle cx="270" cy="62" r="3" fill="#94A3B8"/>
          <!-- Colchão hospitalar confortável -->
          <rect x="4" y="6" width="292" height="16" rx="7" fill="#38BDF8"/>
          <rect x="4" y="6" width="292" height="6" rx="3" fill="#7DD3FC"/>
        </g>

        <!-- 3. Paciente Lucas (Estilo Duolingo / Cartoon Moderno) -->
        <g id="patientBodyGroup" class="${isShivering}">
          <!-- Travesseiro anatômico fofo -->
          <ellipse cx="185" cy="148" rx="28" ry="13" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>

          <!-- Cabeça carismática -->
          <ellipse cx="186" cy="120" rx="22" ry="21" fill="url(#skinDuoGrad)" stroke="#B45309" stroke-width="0.8" style="transition: fill 1s ease;"/>
          
          <!-- Bochechas com blush suave estilo Duolingo -->
          <circle cx="174" cy="125" r="4.5" fill="#FB7185" opacity="${skin.blush}"/>
          <circle cx="200" cy="125" r="4.5" fill="#FB7185" opacity="${skin.blush}"/>

          <!-- Cabelo volumoso cartoon -->
          <path d="M 165 116 C 163 94, 208 94, 208 116 C 201 103, 172 103, 165 116 Z" fill="url(#hairDuoGrad)"/>
          <!-- Mecha estilizada na testa -->
          <path d="M 178 103 Q 186 98 190 106 Q 184 105 178 103 Z" fill="url(#hairDuoGrad)"/>

          <!-- Olhos e Sobrancelhas dinâmicos -->
          ${eyesSvg}

          <!-- Narizinho fofo e boquinha expressiva -->
          <ellipse cx="187" cy="122" rx="1.5" ry="1.2" fill="#D97706" opacity="0.6"/>
          <path d="M 182 129 Q 187 126 192 129" stroke="${skin.lip}" stroke-width="2.2" stroke-linecap="round" fill="none"/>

          <!-- Gotas de suor cartoon -->
          ${sweatSvg}

          <!-- Tórax e Camisa Hospitalar (com animação de respiração suave) -->
          <g class="duo-chest" style="transform-origin: 230px 150px; animation: duolingoBreathing 3s infinite ease-in-out;">
            <path d="M 198 134 L 268 135 L 268 172 L 198 170 Z" fill="url(#gownDuoGrad)" stroke="#5EEAD4" stroke-width="1.8"/>
            <!-- Gola redonda estilizada -->
            <path d="M 198 138 Q 206 146 216 139" stroke="#14B8A6" stroke-width="2" fill="none"/>
            <line x1="202" y1="154" x2="265" y2="155" stroke="#5EEAD4" stroke-width="1.5"/>
          </g>

          <!-- Braço com acesso venoso -->
          <path d="M 205 142 L 250 156" stroke="url(#skinDuoGrad)" stroke-width="10" stroke-linecap="round"/>
          <!-- Curativo transparente do cateter e conexão do equipo -->
          <rect x="235" y="149" width="9" height="9" rx="2.5" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.2"/>
          <circle cx="239.5" cy="153.5" r="2" fill="#0284C7"/>

          <!-- Pelve e Quadril -->
          <path d="M 264 136 L 315 138 L 315 174 L 264 170 Z" fill="url(#skinDuoGrad)"/>
          
          <!-- Hematoma pélvico difuso -->
          <ellipse cx="290" cy="154" rx="${hematomaRadiusX}" ry="${hematomaRadiusY}" 
                   fill="url(#hematomaGrad)" opacity="${hematomaOpacity}"/>

          <!-- Membros Inferiores: Perna direita encurtada com meias cirúrgicas brancas -->
          <!-- Perna esquerda -->
          <path d="M 312 144 L 400 148" stroke="url(#skinDuoGrad)" stroke-width="11" stroke-linecap="round"/>
          <path d="M 396 148 L 408 148" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/> <!-- Meia -->

          <!-- Perna direita (rodada externamente e encurtada) -->
          <path d="M 310 160 L 388 168" stroke="url(#skinDuoGrad)" stroke-width="11" stroke-linecap="round"/>
          <path d="M 382 168 L 396 177" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/> <!-- Pé rodado com meia -->

          <!-- Cinta Pélvica SAM Sling -->
          ${cintaSvg}

          <!-- Manta Térmica Aluminizada -->
          ${mantaSvg}
        </g>

        <!-- 4. Suporte e Infusão -->
        ${infusionBagSvg}
      </svg>
    `;

    this.container.innerHTML = html;
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.PatientRenderer = PatientRenderer;
}

/**
 * MONITOR.JS — Monitor de Sinais Vitais, ECG em Tempo Real e Web Audio Bip
 * Sala Vermelha: Choque Hipovolêmico
 */

class VitalMonitor {
  constructor(panelId, canvasId) {
    this.panel = document.getElementById(panelId);
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;

    // Estado local para tendências
    this.valoresAnteriores = {
      fc: null,
      pas: null,
      fr: null,
      spo2: null
    };

    // Áudio Web Audio API (desligado por padrão)
    this.audioCtx = null;
    this.somHabilitado = false;
    this.bipTimer = null;

    // ECG Canvas setup
    this.ecgOffset = 0;
    this.ecgSpeed = 2;
    this.animFrameId = null;

    // Padrão do complexo P-Q-R-S-T
    this.ecgBuffer = [];
    this.initEcgBuffer();

    if (this.canvas) {
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      this.startEcgLoop();
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.clientWidth || 300;
    this.canvas.height = this.canvas.clientHeight || 64;
  }

  // Gera onda de ECG estilizada contínua
  initEcgBuffer() {
    this.ecgPattern = [
      0, 0, 0, 0, 0, 2, 4, 2, 0, 0, // Onda P
      -3, 26, -10, 0,              // Complexo QRS
      0, 0, 0, 3, 6, 4, 1, 0, 0, 0 // Onda T
    ];
  }

  // Loop de desenho contínuo do ECG no Canvas
  startEcgLoop() {
    const draw = () => {
      if (!this.ctx || !this.canvas) return;

      const w = this.canvas.width;
      const h = this.canvas.height;
      const midY = h / 2;

      // Limpeza suave tipo fósforo
      this.ctx.fillStyle = "rgba(6, 9, 17, 0.18)";
      this.ctx.fillRect(0, 0, w, h);

      // Grade suave de monitor
      this.ctx.strokeStyle = "rgba(0, 255, 136, 0.05)";
      this.ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < w; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, h);
        this.ctx.stroke();
      }

      // Traçado do ECG
      this.ctx.strokeStyle = "#00FF88";
      this.ctx.lineWidth = 2.2;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = "#00FF88";
      this.ctx.beginPath();

      const pontosCount = 60;
      const stepX = w / pontosCount;

      for (let i = 0; i < pontosCount; i++) {
        const x = i * stepX;
        const patternIdx = Math.floor((i + this.ecgOffset) % this.ecgPattern.length);
        const amp = this.ecgPattern[patternIdx] || 0;
        const y = midY - amp;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Velocidade proporcional à frequência cardíaca atual
      const fcAtual = window.gameState?.paciente?.fc || 120;
      this.ecgOffset += (fcAtual / 60) * 0.35;

      this.animFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  // Web Audio Bip agradável e realista
  tocarBip(fc) {
    if (!this.somHabilitado) return;

    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }

      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      // Tom agudo sutil de monitor
      osc.frequency.setValueAtTime(fc > 120 ? 980 : 880, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.09);
    } catch (e) {
      // Ignora falhas em navegadores com restrição estrita
    }
  }

  // Sincroniza o timer de bips com a FC atual
  atualizarBipTimer(fc) {
    if (this.bipTimer) clearInterval(this.bipTimer);

    if (this.somHabilitado && fc > 0) {
      const intervaloMs = Math.max(330, Math.min(1500, (60 / fc) * 1000));
      this.bipTimer = setInterval(() => {
        this.tocarBip(fc);
      }, intervaloMs);
    }
  }

  toggleAudio(forceState) {
    this.somHabilitado = typeof forceState === "boolean" ? forceState : !this.somHabilitado;
    const fc = window.gameState?.paciente?.fc || 128;
    this.atualizarBipTimer(fc);
    return this.somHabilitado;
  }

  // Retorna indicador de tendência visual
  getTrend(novo, anterior) {
    if (anterior === null || anterior === undefined) return "";
    if (novo > anterior) return " ↑";
    if (novo < anterior) return " ↓";
    return "";
  }

  // Atualização em tempo real de toda a interface do monitor
  update(state) {
    if (!this.panel) return;

    const p = state.paciente;
    const pad = state.pad;

    // Tendências
    const trendFc = this.getTrend(p.fc, this.valoresAnteriores.fc);
    const trendPas = this.getTrend(p.pas, this.valoresAnteriores.pas);
    const trendFr = this.getTrend(p.fr, this.valoresAnteriores.fr);
    const trendSpo2 = this.getTrend(p.spo2, this.valoresAnteriores.spo2);

    // Alertas Críticos (PAS < 90, FC > 120, SpO2 < 92)
    const fcCritico = p.fc > 120 || p.fc < 50;
    const paCritica = p.pas < 90;
    const spo2Critico = p.spo2 < 92;
    const frCritica = p.fr > 28 || p.fr < 10;

    // Atualiza bips
    this.atualizarBipTimer(p.fc);

    const html = `
      <div class="monitor-header">
        <span>LEITO 01 • SALA VERMELHA</span>
        <span>PACIENTE: LUCAS (28a)</span>
      </div>

      <div class="ecg-screen-wrapper">
        <canvas id="ecgCanvasMonitor" class="ecg-canvas"></canvas>
      </div>

      <div class="monitor-grid-display" aria-live="polite">
        <!-- FC -->
        <div class="vital-param-card ${fcCritico ? 'alert-critico' : ''}">
          <span class="param-label">FC <span>${trendFc}</span></span>
          <span class="param-value" style="color: ${fcCritico ? 'var(--monitor-alert)' : 'var(--monitor-text)'};">
            ${p.fc} <span class="param-unit">bpm</span>
          </span>
        </div>

        <!-- PA -->
        <div class="vital-param-card ${paCritica ? 'alert-critico' : ''}">
          <span class="param-label">PA <span>${trendPas}</span></span>
          <span class="param-value" style="color: ${paCritica ? 'var(--monitor-alert)' : 'var(--monitor-yellow)'};">
            ${p.pas}/${pad} <span class="param-unit">mmHg</span>
          </span>
        </div>

        <!-- SpO2 -->
        <div class="vital-param-card ${spo2Critico ? 'alert-critico' : ''}">
          <span class="param-label">SpO₂ <span>${trendSpo2}</span></span>
          <span class="param-value" style="color: ${spo2Critico ? 'var(--monitor-alert)' : 'var(--monitor-blue)'};">
            ${p.spo2} <span class="param-unit">%</span>
          </span>
        </div>

        <!-- FR -->
        <div class="vital-param-card ${frCritica ? 'alert-critico' : ''}">
          <span class="param-label">FR <span>${trendFr}</span></span>
          <span class="param-value" style="color: ${frCritica ? 'var(--monitor-alert)' : '#FFFFFF'};">
            ${p.fr} <span class="param-unit">irpm</span>
          </span>
        </div>
      </div>

      <!-- Medidores de Volume e Temperatura -->
      <div class="patient-meters-row">
        <div class="meter-wrapper">
          <div class="meter-label">
            <span>Volume Circulante</span>
            <span>${p.volume}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" style="width: ${p.volume}%; background: ${p.volume < 40 ? '#FF3366' : '#2EC4B6'};"></div>
          </div>
        </div>

        <div class="meter-wrapper">
          <div class="meter-label">
            <span>Índice Térmico</span>
            <span>${p.temperatura}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" style="width: ${p.temperatura}%; background: ${p.temperatura < 60 ? '#48CAE4' : '#FFD166'};"></div>
          </div>
        </div>
      </div>
    `;

    this.panel.innerHTML = html;

    // Reconectar o canvas após re-renderizar o container
    this.canvas = document.getElementById("ecgCanvasMonitor");
    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
    }

    // Armazenar valores atuais para a próxima comparação de tendência
    this.valoresAnteriores = {
      fc: p.fc,
      pas: p.pas,
      fr: p.fr,
      spo2: p.spo2
    };
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.VitalMonitor = VitalMonitor;
}

/**
 * TRILHA.JS — Gerenciador e minijogos das 6 paradas teóricas da Trilha
 * Sala Vermelha: Choque Hipovolêmico
 */

class TrilhaManager {
  constructor() {
    this.paradaAtual = 1;
  }

  // Renderiza a parada teórica pelo ID (1 a 6)
  renderParada(paradaId) {
    const data = window.CLINICAL_DATA?.trilha?.find(p => p.id === paradaId);
    if (!data) return;

    this.paradaAtual = paradaId;
    const container = document.getElementById("paradaContentArea");
    if (!container) return;

    // Atualiza cabeçalho da parada
    const htmlHeader = `
      <div class="parada-header">
        <div class="parada-header-titles">
          <span class="hero-header-badge">PARADA ${data.numero} DE 6</span>
          <h2>${data.titulo}</h2>
          <p class="sub">${data.subtitulo}</p>
        </div>
        <button class="btn btn-outline btn-mini" id="btnVoltarAoMapaTop">
          🗺️ Voltar ao Mapa
        </button>
      </div>

      <!-- Texto Teórico Didático -->
      <div class="parada-bloco-texto">
        ${data.conteudo.map(p => `<p>${p}</p>`).join("")}
      </div>

      <!-- Card Para Fixar -->
      <div class="card-para-fixar">
        <span>📌</span>
        <span><strong>Para fixar:</strong> "${data.paraFixar}"</span>
      </div>
    `;

    // Renderiza a interação específica
    let htmlInteracao = `<div class="interactive-playground" id="playgroundArea">`;
    if (paradaId === 1) htmlInteracao += this.renderInteracaoP1(data);
    else if (paradaId === 2) htmlInteracao += this.renderInteracaoP2(data);
    else if (paradaId === 3) htmlInteracao += this.renderInteracaoP3(data);
    else if (paradaId === 4) htmlInteracao += this.renderInteracaoP4(data);
    else if (paradaId === 5) htmlInteracao += this.renderInteracaoP5(data);
    else if (paradaId === 6) htmlInteracao += this.renderInteracaoP6(data);
    htmlInteracao += `</div>`;

    // Navegação Inferior
    const htmlFooter = `
      <div class="trilha-nav-buttons">
        <button class="btn btn-outline" id="btnParadaAnterior" ${paradaId === 1 ? 'disabled' : ''}>
          ← Anterior
        </button>
        <button class="btn btn-primary" id="btnConcluirParada">
          ${paradaId === 6 ? 'Ir para o Caso Clínico 🚨' : 'Concluir e Avançar →'}
        </button>
      </div>
    `;

    container.innerHTML = htmlHeader + htmlInteracao + htmlFooter;

    // Conectar eventos da parada
    this.bindEventsParada(paradaId);
  }

  // ==========================================================================
  // PARADA 1 — Vaso com Líquido e Coração
  // ==========================================================================
  renderInteracaoP1(data) {
    return `
      <div class="playground-title">🔬 Interação: Volume Circulante vs Bomba Cardíaca</div>
      <p style="font-size: 0.95rem;">${data.interacao.instrucao}</p>
      
      <div class="vaso-interativo-container">
        <div style="display: flex; gap: 2rem; align-items: center; justify-content: center; flex-wrap: wrap;">
          <!-- Vaso Sanguíneo Ilustrado SVG -->
          <div class="vaso-svg-wrapper">
            <svg viewBox="0 0 160 220" width="160" height="220">
              <!-- Frasco de Vidro / Vaso -->
              <rect x="25" y="20" width="110" height="180" rx="14" fill="none" stroke="#1D2B53" stroke-width="4"/>
              <!-- Marcações de Volume (Graduação) -->
              <line x1="30" y1="60" x2="45" y2="60" stroke="#1D2B53" stroke-width="2"/>
              <text x="50" y="64" font-size="9" font-family="'Nunito', sans-serif">100%</text>
              <line x1="30" y1="110" x2="45" y2="110" stroke="#1D2B53" stroke-width="2"/>
              <text x="50" y="114" font-size="9" font-family="'Nunito', sans-serif">65%</text>
              <line x1="30" y1="160" x2="45" y2="160" stroke="#1D2B53" stroke-width="2"/>
              <text x="50" y="164" font-size="9" font-family="'Nunito', sans-serif">30%</text>

              <!-- Nível de Sangue Líquido Dinâmico -->
              <rect id="vasoNivelSangue" x="29" y="30" width="102" height="166" rx="10" fill="#E63946" opacity="0.88"/>
              <!-- Gotinhas animadas -->
              <circle cx="80" cy="100" r="4" fill="#FFFFFF" opacity="0.4"/>
            </svg>
          </div>

          <!-- Coração SVG que pulsa com velocidade proporcional -->
          <div class="coracao-svg-wrapper" style="text-align: center;">
            <svg id="coracaoSvgP1" viewBox="0 0 100 100" width="110" height="110" style="transition: transform 0.2s ease;">
              <path d="M 50 85 C 50 85, 10 55, 10 32 A 22 22 0 0 1 50 20 A 22 22 0 0 1 90 32 C 90 55, 50 85, 50 85 Z" fill="#E63946"/>
              <circle cx="36" cy="32" r="3" fill="#FFFFFF" opacity="0.6"/>
            </svg>
            <div id="coracaoRitmoTexto" style="font-size: 0.85rem; font-weight: 700; color: var(--navy-blue); margin-top: 0.25rem;">
              Ritmo: 75 bpm (Normal)
            </div>
          </div>
        </div>

        <!-- Slider de Volume -->
        <div class="slider-volume-control">
          <label for="sliderVolP1" style="font-weight: 700; font-size: 0.9rem; display: flex; justify-content: space-between;">
            <span>Volume Intravascular:</span>
            <span id="sliderVolP1Val" style="color: var(--coral-red);">100%</span>
          </label>
          <input type="range" id="sliderVolP1" class="slider-custom" min="20" max="100" value="100" step="5">
          <div id="feedbackVolP1" style="font-size: 0.9rem; color: var(--text-muted); background: var(--bg-card); padding: 0.5rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--aqua-green); margin-top: 0.5rem;">
            ${data.interacao.mensagensNivel.alto}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARADA 2 — Etiologia: Flip Cards e Minijogo de Classificação
  // ==========================================================================
  renderInteracaoP2(data) {
    const flipHtml = `
      <div class="playground-title">🗂️ Os Dois Grandes Grupos Etiológicos (Toque nos cards para virar)</div>
      <div class="flip-cards-container">
        ${data.gruposFlip.map(g => `
          <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <span style="font-size: 2.2rem; margin-bottom: 0.5rem;">${g.grupo === 'Hemorrágico' ? '🩸' : '💧'}</span>
                <h3 style="color: var(--coral-red);">${g.grupo}</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted);">${g.subtitulo}</p>
                <span class="btn-text-badge" style="margin: 0.5rem auto 0;">🔄 Toque para ver causas</span>
              </div>
              <div class="flip-card-back">
                <h4 style="color: var(--yellow-gold); margin-bottom: 0.4rem;">Causas: ${g.grupo}</h4>
                <ul>
                  ${g.exemplos.map(ex => `<li>${ex}</li>`).join("")}
                </ul>
                <p style="font-size: 0.78rem; opacity: 0.9; margin-top: 0.3rem;"><em>💡 ${g.destaque}</em></p>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Minijogo: Classifique a Causa -->
      <div style="margin-top: 1.5rem; border-top: 2px dashed var(--border-color); padding-top: 1.25rem;">
        <div class="playground-title">🎮 Minijogo: ${data.minijogo.titulo}</div>
        <p style="font-size: 0.9rem;">${data.minijogo.instrucao}</p>

        <div class="cartas-classificacao-grid">
          ${data.minijogo.cartas.map(c => `
            <div class="carta-classificar-item" id="cartaItem_${c.id}" data-id="${c.id}" data-tipo="${c.tipo}">
              <p style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.4rem;">${c.texto}</p>
              <div class="botoes-classificar-row">
                <button class="btn btn-outline btn-mini btn-classif" data-id="${c.id}" data-escolha="hemorragica">
                  🩸 Hemorrágico
                </button>
                <button class="btn btn-outline btn-mini btn-classif" data-id="${c.id}" data-escolha="nao_hemorragica">
                  💧 Não Hemorrágico
                </button>
              </div>
              <div class="feedback-msg" style="font-size: 0.8rem; margin-top: 0.35rem; display: none;"></div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    return flipHtml;
  }

  // ==========================================================================
  // PARADA 3 — Fisiopatologia: A Reação em Cadeia e Tríade Letal
  // ==========================================================================
  renderInteracaoP3(data) {
    return `
      <div class="playground-title">⚡ A Reação em Cadeia Fisiopatológica</div>
      <p style="font-size: 0.95rem;">Clique no botão para avançar cada elo da cascata e observar o colapso compensatório:</p>

      <div style="text-align: right; margin-bottom: 0.75rem;">
        <button class="btn btn-secondary btn-mini" id="btnAvancarCadeia">Próximo Passo da Cascata ➔</button>
      </div>

      <div class="cadeia-fisiopatologia-stepper" id="stepperFisiopatologia">
        ${data.fases.map((f, i) => `
          <div class="passo-cadeia-item ${i === 0 ? 'ativo' : ''}" data-step="${i + 1}">
            <div class="parada-numero" style="width: 36px; height: 36px; font-size: 1rem;">${f.etapa}</div>
            <div style="flex: 1;">
              <h4 style="color: var(--navy-blue); margin-bottom: 0.2rem;">${f.nome}</h4>
              <p style="font-size: 0.9rem; margin-bottom: 0.4rem;">${f.detalhe}</p>
              <!-- Barra de Compensação Orgânica -->
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem;">
                <span style="font-weight: 700; color: var(--text-muted);">Capacidade de Compensação:</span>
                <div style="flex: 1; max-width: 150px; height: 6px; background: #E2E8F0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${f.compensacaoBarra}%; height: 100%; background: ${f.compensacaoBarra > 50 ? 'var(--aqua-green)' : 'var(--coral-red)'};"></div>
                </div>
                <span>${f.compensacaoBarra}%</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Card Destaque: Tríade Letal com Engrenagens -->
      <div style="margin-top: 1.5rem; background: var(--bg-card); border: 2px solid var(--coral-red); border-radius: var(--radius-md); padding: 1.1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
          <svg viewBox="0 0 60 60" width="36" height="36" class="gear-cw">
            <path d="M 30 10 L 33 16 L 40 14 L 41 21 L 48 22 L 46 29 L 50 34 L 45 38 L 46 45 L 39 46 L 36 52 L 30 49 L 24 52 L 21 46 L 14 45 L 15 38 L 10 34 L 14 29 L 12 22 L 19 21 L 20 14 L 27 16 Z" fill="#E63946"/>
            <circle cx="30" cy="30" r="8" fill="#FFFFFF"/>
          </svg>
          <h4 style="color: var(--coral-red); margin: 0; font-size: 1.1rem;">${data.triadeLetal.titulo}</h4>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
          ${data.triadeLetal.componentes.map(c => `
            <div style="background: var(--coral-red-light); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--coral-red);">
              <strong style="color: var(--coral-red);">${c.nome}:</strong>
              <p style="font-size: 0.82rem; margin: 0.2rem 0 0;">${c.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARADA 4 — Sinais e Sintomas: Corpo Humano Interativo e Slider de Choque
  // ==========================================================================
  renderInteracaoP4(data) {
    return `
      <div class="playground-title">🩺 O Corpo Fala: Toque nos Órgãos Alvo</div>
      <p style="font-size: 0.95rem;">Toque nos pontos brilhantes do corpo para examinar o que acontece e o que a enfermagem observa:</p>

      <div class="corpo-humano-interativo">
        <!-- SVG Ilustrado do Corpo Humano com Hotspots -->
        <div class="corpo-svg-container">
          <svg viewBox="0 0 240 400" width="240" height="400">
            <!-- Silhueta Humana Cartoon Amigável -->
            <g fill="#E2E8F0" stroke="#A0AEC0" stroke-width="2">
              <!-- Cabeça -->
              <circle cx="120" cy="50" r="26"/>
              <!-- Pescoço -->
              <rect x="114" y="74" width="12" height="12"/>
              <!-- Tronco -->
              <path d="M 90 86 L 150 86 L 144 210 L 96 210 Z" rx="10"/>
              <!-- Braços -->
              <path d="M 88 88 L 60 180 L 52 178 L 80 86 Z"/>
              <path d="M 152 88 L 180 180 L 188 178 L 160 86 Z"/>
              <!-- Pernas -->
              <path d="M 98 210 L 90 350 L 105 350 L 115 210 Z"/>
              <path d="M 142 210 L 150 350 L 135 350 L 125 210 Z"/>
            </g>

            <!-- Hotspots Interativos Pulsantes -->
            <!-- Cérebro -->
            <circle class="hotspot-dot" data-id="cerebro" cx="120" cy="50" r="9" fill="#E63946" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Coração -->
            <circle class="hotspot-dot" data-id="coracao" cx="126" cy="115" r="9" fill="#E63946" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Pulmões -->
            <circle class="hotspot-dot" data-id="pulmoes" cx="106" cy="125" r="9" fill="#2EC4B6" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Rins -->
            <circle class="hotspot-dot" data-id="rins" cx="120" cy="170" r="9" fill="#FFD166" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Pele / Extremidades -->
            <circle class="hotspot-dot" data-id="pele" cx="56" cy="180" r="9" fill="#2EC4B6" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Vasos / Pressão -->
            <circle class="hotspot-dot" data-id="vasos" cx="120" cy="225" r="9" fill="#1D2B53" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
          </svg>
        </div>

        <!-- Painel de Informação do Hotspot Clicado -->
        <div class="hotspot-info-box" id="hotspotInfoDisplay">
          <h4 id="hotspotNome" style="color: var(--coral-red); margin-bottom: 0.35rem;">Cérebro (Neurológico)</h4>
          <p id="hotspotAcontece" style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>O que acontece:</strong> Hipoperfusão do sistema nervoso central e ação da adrenalina.</p>
          <div style="background: var(--navy-blue-light); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--navy-blue);">
            <strong style="color: var(--navy-blue); font-size: 0.85rem;">O que o Enfermeiro observa:</strong>
            <p id="hotspotObserva" style="font-size: 0.85rem; margin: 0.2rem 0 0;">Ansiedade precoce, agitação motora, confusão mental, sonolência e letargia tardia.</p>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.6rem;">💡 Toque em outros pontos do corpo para inspecionar!</p>
        </div>
      </div>

      <!-- Slider das 4 Classes de Hemorragia -->
      <div style="margin-top: 1.75rem; border-top: 2px dashed var(--border-color); padding-top: 1.25rem;">
        <div class="playground-title">📊 ${data.sliderHemorragia.titulo}</div>
        <p style="font-size: 0.9rem;">${data.sliderHemorragia.instrucao}</p>

        <div style="max-width: 500px; margin: 0.5rem 0 1rem;">
          <input type="range" id="sliderClasseHemo" class="slider-custom" min="5" max="45" value="10" step="10">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-top: 0.25rem;">
            <span>Classe I (<15%)</span>
            <span>Classe II (15-30%)</span>
            <span>Classe III (30-40%)</span>
            <span>Classe IV (>40%)</span>
          </div>
        </div>

        <!-- Card da Classe Selecionada -->
        <div id="cardClasseHemoDisplay" style="background: var(--bg-card); border: 2px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <h4 id="displayClasseNome" style="color: var(--coral-red); margin: 0;">Classe I — Perda até 15% (~750 mL)</h4>
            <span class="btn-text-badge" id="displayClasseBadge">Compensado</span>
          </div>
          <p id="displayClasseResumo" style="font-size: 0.9rem; margin-bottom: 0.5rem;">Totalmente compensado. Sintomas mínimos, similar a uma doação de sangue.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; font-size: 0.8rem; background: var(--bg-card-alt); padding: 0.5rem; border-radius: var(--radius-sm);">
            <div><strong>FC:</strong> <span id="dispFC">Normal (< 100 bpm)</span></div>
            <div><strong>PA:</strong> <span id="dispPA">Normal</span></div>
            <div><strong>FR:</strong> <span id="dispFR">14 a 20 irpm</span></div>
            <div><strong>Sensório:</strong> <span id="dispMental">Pouco ansioso</span></div>
          </div>
        </div>

        <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--coral-red); font-weight: 700;">
          ⚠️ ${data.avisoClinico}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARADA 5 — Diagnóstico: Bandeja de Exames
  // ==========================================================================
  renderInteracaoP5(data) {
    return `
      <div class="playground-title">🔬 Interação: Monte a Bandeja de Exames da Sala Vermelha</div>
      <p style="font-size: 0.95rem;">Toque em cada exame para entender sua utilidade e a conduta direta de enfermagem:</p>

      <div style="background: var(--coral-red-light); border-left: 4px solid var(--coral-red); padding: 0.75rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 1.25rem; font-size: 0.9rem; color: #5A121A;">
        <strong>⚠️ Ponto Clínico Crucial:</strong> ${data.alertaImportante}
      </div>

      <div class="bandeja-exames-grid">
        ${data.bandejaExames.map(ex => `
          <div class="exame-item-card" data-id="${ex.id}">
            <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">📋</div>
            <h4 style="font-size: 0.95rem; color: var(--navy-blue); margin-bottom: 0.2rem;">${ex.nome}</h4>
            <span style="font-size: 0.75rem; background: var(--navy-blue-light); padding: 0.15rem 0.5rem; border-radius: 99px;">${ex.tipo}</span>
          </div>
        `).join("")}
      </div>

      <!-- Detalhes do Exame Clicado -->
      <div id="detalheExameContainer" style="background: var(--bg-card); border: 2px solid var(--aqua-green); border-radius: var(--radius-md); padding: 1.1rem; margin-top: 1.25rem; display: none;">
        <h4 id="detExameTitulo" style="color: var(--aqua-green); margin-bottom: 0.35rem;">Nome do Exame</h4>
        <p id="detExameParaQueServe" style="font-size: 0.9rem; margin-bottom: 0.5rem;"></p>
        <div style="background: var(--aqua-green-light); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--aqua-green);">
          <strong style="color: var(--aqua-green-dark); font-size: 0.85rem;">O que o Enfermeiro faz:</strong>
          <p id="detExamePapel" style="font-size: 0.85rem; margin: 0.2rem 0 0;"></p>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARADA 6 — Tratamento: Ordene os Passos do XABCDE
  // ==========================================================================
  renderInteracaoP6(data) {
    const passos = [...data.minijogoXabcde.passosCorretos];
    // Embaralha para o minijogo
    const embaralhados = [...passos].sort(() => Math.random() - 0.5);

    return `
      <div class="playground-title">🎯 Minijogo: ${data.minijogoXabcde.titulo}</div>
      <p style="font-size: 0.95rem;">${data.minijogoXabcde.instrucao}</p>

      <div class="xabcde-sort-container" id="xabcdeCardsList">
        ${embaralhados.map(p => `
          <button class="xabcde-card-btn" data-ordem="${p.ordem}" data-letra="${p.letra}">
            <div class="parada-numero" style="width: 38px; height: 38px; font-size: 1.1rem; background: var(--coral-red);">${p.letra}</div>
            <div style="flex: 1;">
              <strong style="font-size: 0.95rem; color: var(--navy-blue);">${p.titulo}</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.15rem 0 0;">${p.descricao}</p>
            </div>
          </button>
        `).join("")}
      </div>

      <div id="xabcdeFeedbackMsg" style="margin-top: 1rem; text-align: center; font-weight: 700; font-size: 0.95rem; color: var(--aqua-green); display: none;">
        🎉 Parabéns! Você ordenou perfeitamente toda a cadeia do XABCDE no trauma!
      </div>
    `;
  }

  // ==========================================================================
  // BIND DE EVENTOS DAS PARADAS
  // ==========================================================================
  bindEventsParada(paradaId) {
    // Voltar ao mapa
    document.getElementById("btnVoltarAoMapaTop")?.addEventListener("click", () => {
      window.uiManager?.mostrarTela("telaMapaTrilha");
    });

    // Anterior / Avançar
    document.getElementById("btnParadaAnterior")?.addEventListener("click", () => {
      if (paradaId > 1) this.renderParada(paradaId - 1);
    });

    document.getElementById("btnConcluirParada")?.addEventListener("click", () => {
      window.gameState?.concluirParadaTrilha(paradaId);
      if (paradaId < 6) {
        this.renderParada(paradaId + 1);
      } else {
        // Vai para a Parada 7 (Caso Clínico)
        window.uiManager?.iniciarCasoClinico();
      }
    });

    // Eventos Específicos de cada parada
    if (paradaId === 1) this.bindEventsP1();
    else if (paradaId === 2) this.bindEventsP2();
    else if (paradaId === 3) this.bindEventsP3();
    else if (paradaId === 4) this.bindEventsP4();
    else if (paradaId === 5) this.bindEventsP5();
    else if (paradaId === 6) this.bindEventsP6();
  }

  bindEventsP1() {
    const slider = document.getElementById("sliderVolP1");
    const valText = document.getElementById("sliderVolP1Val");
    const vasoNivel = document.getElementById("vasoNivelSangue");
    const coracao = document.getElementById("coracaoSvgP1");
    const ritmoTexto = document.getElementById("coracaoRitmoTexto");
    const feedback = document.getElementById("feedbackVolP1");
    const msgs = window.CLINICAL_DATA?.trilha[0]?.interacao?.mensagensNivel;

    if (!slider) return;

    slider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      valText.textContent = `${val}%`;

      // Atualiza altura do líquido no vaso SVG (max y=30, height=166)
      const maxH = 166;
      const h = (val / 100) * maxH;
      const y = 30 + (maxH - h);
      vasoNivel.setAttribute("y", y);
      vasoNivel.setAttribute("height", h);

      // Ritmo e tamanho do batimento
      if (val >= 85) {
        coracao.style.transform = "scale(1)";
        ritmoTexto.textContent = "Ritmo: 75 bpm (Normal)";
        ritmoTexto.style.color = "var(--navy-blue)";
        feedback.textContent = msgs.alto;
      } else if (val >= 65) {
        coracao.style.transform = "scale(1.15)";
        ritmoTexto.textContent = "Ritmo: 110 bpm (Taquicardia Compensatória)";
        ritmoTexto.style.color = "var(--yellow-dark)";
        feedback.textContent = msgs.medio;
      } else {
        coracao.style.transform = "scale(1.28)";
        ritmoTexto.textContent = "Ritmo: 135 bpm (Choque Grave / Esvaziamento)";
        ritmoTexto.style.color = "var(--coral-red)";
        feedback.textContent = msgs.critico;
      }
    });
  }

  bindEventsP2() {
    const btns = document.querySelectorAll(".btn-classif");
    const cartasData = window.CLINICAL_DATA?.trilha[1]?.minijogo?.cartas || [];

    btns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        const escolha = btn.getAttribute("data-escolha");
        const carta = cartasData.find(c => c.id === id);
        const cardElem = document.getElementById(`cartaItem_${id}`);
        const feedbackElem = cardElem?.querySelector(".feedback-msg");

        if (!carta || !cardElem || !feedbackElem) return;

        if (escolha === carta.tipo) {
          cardElem.style.borderColor = "var(--aqua-green)";
          cardElem.style.backgroundColor = "var(--aqua-green-light)";
          cardElem.classList.add("pulse-success");
          feedbackElem.textContent = `✔ ${carta.feedback}`;
          feedbackElem.style.color = "var(--aqua-green-dark)";
          feedbackElem.style.display = "block";
          // Desabilita botões desta carta
          cardElem.querySelectorAll(".btn-classif").forEach(b => b.disabled = true);
        } else {
          cardElem.classList.add("shake-error");
          setTimeout(() => cardElem.classList.remove("shake-error"), 500);
          feedbackElem.textContent = "✖ Pense no tipo de líquido perdido nesta situação!";
          feedbackElem.style.color = "var(--coral-red)";
          feedbackElem.style.display = "block";
        }
      });
    });
  }

  bindEventsP3() {
    let currentStep = 1;
    const btn = document.getElementById("btnAvancarCadeia");
    const items = document.querySelectorAll(".passo-cadeia-item");

    btn?.addEventListener("click", () => {
      currentStep++;
      if (currentStep > items.length) currentStep = 1;

      items.forEach((item, idx) => {
        if (idx < currentStep) {
          item.classList.add("ativo");
        } else {
          item.classList.remove("ativo");
        }
      });
    });
  }

  bindEventsP4() {
    // Hotspots do Corpo
    const dots = document.querySelectorAll(".hotspot-dot");
    const hotspotsData = window.CLINICAL_DATA?.trilha[3]?.hotspotsCorpo || [];

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const id = dot.getAttribute("data-id");
        const item = hotspotsData.find(h => h.id === id);
        if (!item) return;

        document.getElementById("hotspotNome").textContent = item.nome;
        document.getElementById("hotspotAcontece").innerHTML = `<strong>O que acontece:</strong> ${item.acontece}`;
        document.getElementById("hotspotObserva").textContent = item.observaEnfermeiro;

        // Feedback visual
        dots.forEach(d => d.setAttribute("stroke-width", "2.5"));
        dot.setAttribute("stroke-width", "5");
      });
    });

    // Slider das 4 Classes
    const slider = document.getElementById("sliderClasseHemo");
    const classes = window.CLINICAL_DATA?.trilha[3]?.sliderHemorragia?.classes || [];

    slider?.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      let classeObj = classes[0];

      if (val > 40) classeObj = classes[3];
      else if (val > 30) classeObj = classes[2];
      else if (val > 15) classeObj = classes[1];

      document.getElementById("displayClasseNome").textContent = `${classeObj.classe} — Perda ${classeObj.perdaPercent} (${classeObj.volumeAprox})`;
      document.getElementById("displayClasseBadge").textContent = classeObj.classe;
      document.getElementById("displayClasseResumo").textContent = classeObj.resumo;
      document.getElementById("dispFC").textContent = classeObj.fc;
      document.getElementById("dispPA").textContent = classeObj.pa;
      document.getElementById("dispFR").textContent = classeObj.fr;
      document.getElementById("dispMental").textContent = classeObj.mental;
    });
  }

  bindEventsP5() {
    const cards = document.querySelectorAll(".exame-item-card");
    const examesData = window.CLINICAL_DATA?.trilha[4]?.bandejaExames || [];
    const container = document.getElementById("detalheExameContainer");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        const exame = examesData.find(e => e.id === id);
        if (!exame || !container) return;

        cards.forEach(c => c.classList.remove("selecionado"));
        card.classList.add("selecionado");

        document.getElementById("detExameTitulo").textContent = exame.nome;
        document.getElementById("detExameParaQueServe").innerHTML = `<strong>Para que serve:</strong> ${exame.paraQueServe}`;
        document.getElementById("detExamePapel").textContent = exame.papelEnfermagem;
        container.style.display = "block";
      });
    });
  }

  bindEventsP6() {
    let proximaOrdemEsperada = 1;
    const cards = document.querySelectorAll(".xabcde-card-btn");
    const feedback = document.getElementById("xabcdeFeedbackMsg");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const ordem = parseInt(card.getAttribute("data-ordem"), 10);

        if (ordem === proximaOrdemEsperada) {
          card.classList.add("acertou", "pulse-success");
          card.disabled = true;
          proximaOrdemEsperada++;

          if (proximaOrdemEsperada > cards.length && feedback) {
            feedback.style.display = "block";
          }
        } else {
          card.classList.add("shake-error");
          setTimeout(() => card.classList.remove("shake-error"), 500);
        }
      });
    });
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.trilhaManager = new TrilhaManager();
}

/**
 * UI.JS — Renderizador de Telas, Modais, Mini-Animações e Interações do Usuário
 * Sala Vermelha: Choque Hipovolêmico
 */

class UIManager {
  constructor() {
    this.telas = [
      "telaHome",
      "telaMapaTrilha",
      "telaParadaTeorica",
      "telaCasoClinico",
      "telaFinalCaso"
    ];
    this.telaAtualId = "telaHome";
  }

  // Troca suave de telas
  mostrarTela(idTelaAlvo) {
    this.telas.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === idTelaAlvo) {
          el.classList.add("active");
          el.removeAttribute("hidden");
        } else {
          el.classList.remove("active");
          el.setAttribute("hidden", "true");
        }
      }
    });

    this.telaAtualId = idTelaAlvo; window.dispatchEvent(new CustomEvent("sala-screen", {detail: idTelaAlvo}));
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Atualiza barras e mapas quando aplicável
    this.atualizarBarraProgresso();
    if (idTelaAlvo === "telaMapaTrilha") {
      this.renderMapaTrilha();
    }
  }

  // Atualiza a barra de progresso no topo
  atualizarBarraProgresso() {
    const totalParadas = 7; // 6 teóricas + 1 caso clínico
    let concluidas = window.gameState?.trilhaConcluida?.size || 0;
    if (window.gameState?.jogoFinalizado) concluidas++;

    const percent = Math.min(100, Math.round((concluidas / totalParadas) * 100));
    const fill = document.getElementById("trilhaProgressFill");
    const text = document.getElementById("trilhaProgressText");

    window.dispatchEvent(new CustomEvent("sala-progress", {detail: {concluidas, percent}}));
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${concluidas} de ${totalParadas} etapas (${percent}%)`;
  }

  // Renderiza o mapa da trilha com as 7 paradas
  renderMapaTrilha() {
    const grid = document.getElementById("mapaTrilhaCardsGrid");
    if (!grid) return;

    const trilhaData = window.CLINICAL_DATA?.trilha || [];
    const htmlCards = trilhaData.map(p => {
      const concluida = window.gameState?.isParadaConcluida(p.id);
      return `
        <div class="parada-card ${concluida ? 'concluida' : ''}" data-parada-id="${p.id}" tabindex="0" role="button" aria-label="Parada ${p.numero}: ${p.titulo}">
          <div class="parada-numero">${concluida ? '✔' : p.numero}</div>
          <div class="parada-info">
            <h3>${p.titulo}</h3>
            <p>${p.subtitulo}</p>
          </div>
          <div class="parada-status-icon">
            ${concluida ? '<span>Concluída</span>' : '<span>➔</span>'}
          </div>
        </div>
      `;
    }).join("");

    // Card especial do Caso Clínico (Parada 7)
    const casoFinalizado = window.gameState?.jogoFinalizado;
    const cardCaso = `
      <div class="parada-card caso-card ${casoFinalizado ? 'concluida' : ''}" id="cardAcessarCasoClinico" tabindex="0" role="button">
        <div class="parada-numero" style="background: var(--coral-red);">${casoFinalizado ? '✔' : '7'}</div>
        <div class="parada-info">
          <h3 style="color: var(--coral-red);">🚨 Caso Clínico Interativo (Plantão na Sala Vermelha)</h3>
          <p>Assuma o papel do enfermeiro no atendimento de Lucas (28a): politrauma com choque hemorrágico!</p>
        </div>
        <div class="parada-status-icon" style="color: var(--coral-red);">
          <strong>Jogar ➔</strong>
        </div>
      </div>
    `;

    grid.innerHTML = htmlCards + cardCaso;

    // Adiciona cliques nos cards
    grid.querySelectorAll(".parada-card[data-parada-id]").forEach(card => {
      card.addEventListener("click", () => {
        const id = parseInt(card.getAttribute("data-parada-id"), 10);
        this.abrirParadaTeorica(id);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          const id = parseInt(card.getAttribute("data-parada-id"), 10);
          this.abrirParadaTeorica(id);
        }
      });
    });

    document.getElementById("cardAcessarCasoClinico")?.addEventListener("click", () => {
      this.iniciarCasoClinico();
    });
  }

  abrirParadaTeorica(paradaId) {
    this.mostrarTela("telaParadaTeorica");
    window.trilhaManager?.renderParada(paradaId);
  }

  // ==========================================================================
  // CASO CLÍNICO INTERATIVO (SERIOUS GAME)
  // ==========================================================================
  iniciarCasoClinico() {
    this.mostrarTela("telaCasoClinico");
    this.renderEtapaCaso(window.gameState.etapaAtualIndex);
  }

  renderEtapaCaso(etapaIndex) {
    const etapas = window.CLINICAL_DATA?.casoClinico?.etapas || [];
    const etapa = etapas[etapaIndex];
    if (!etapa) return;

    // Atualiza badges e cabeçalhos
    const badgeFase = document.getElementById("casoFaseBadge");
    const tituloEtapa = document.getElementById("casoTituloEtapa");
    const situacaoTexto = document.getElementById("casoSituacaoTexto");
    const sinaisLista = document.getElementById("casoSinaisLista");
    const btnDica = document.getElementById("btnUsarDicaGota");
    const dicasRestantesTexto = document.getElementById("dicasRestantesNum");

    if (badgeFase) badgeFase.textContent = `${etapa.fase} • ETAPA ${etapa.numero} DE 5`;
    if (tituloEtapa) tituloEtapa.textContent = etapa.titulo;
    if (situacaoTexto) situacaoTexto.textContent = etapa.situacao;

    if (sinaisLista) {
      sinaisLista.innerHTML = etapa.sinais.map(s => `<li>${s}</li>`).join("");
    }

    if (dicasRestantesTexto) {
      dicasRestantesTexto.textContent = window.gameState.dicasRestantes;
    }
    if (btnDica) {
      btnDica.disabled = window.gameState.dicasRestantes <= 0;
    }

    // Embaralha as 3 opções para esta rodada (referenciadas estritamente por ID)
    const opcoesEmbaralhadas = window.gameState.embaralharOpcoes(etapa.opcoes);
    const containerOpcoes = document.getElementById("casoOpcoesList");
    if (!containerOpcoes) return;

    const letras = ["A", "B", "C"];
    containerOpcoes.innerHTML = opcoesEmbaralhadas.map((op, idx) => `
      <button class="opcao-conduta-item" data-opcao-id="${op.id}" id="btnOpcao_${op.id}">
        <span class="opcao-letra">${letras[idx]}</span>
        <span class="opcao-texto">${op.texto}</span>
      </button>
    `).join("");

    // Oculta feedback anterior
    const feedbackCard = document.getElementById("casoFeedbackCard");
    if (feedbackCard) {
      feedbackCard.className = "feedback-escolha-container";
      feedbackCard.style.display = "none";
    }

    // Conecta cliques nas opções
    containerOpcoes.querySelectorAll(".opcao-conduta-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-opcao-id");
        this.processarEscolhaJogador(etapaIndex, id, etapa);
      });
    });

    // Atualiza paciente e monitor
    window.patientRenderer?.render(window.gameState);
    window.vitalMonitor?.update(window.gameState);
  }

  // Processa a escolha do usuário
  processarEscolhaJogador(etapaIndex, opcaoId, etapa) {
    const opcao = etapa.opcoes.find(o => o.id === opcaoId);
    if (!opcao) return;

    // Desabilita todas as opções para evitar múltiplos cliques
    const botoes = document.querySelectorAll(".opcao-conduta-item");
    botoes.forEach(b => b.disabled = true);

    // Aplica efeitos no estado do paciente
    window.gameState.aplicarEfeitos(opcao.efeitos, opcaoId);
    // Registra pontuação e histórico
    window.gameState.registrarEscolha(etapaIndex, opcao);

    // Efeito visual no botão clicado
    const btnClicado = document.getElementById(`btnOpcao_${opcaoId}`);
    if (opcao.tipo === "correta") {
      btnClicado?.classList.add("pulse-success");
    } else {
      btnClicado?.classList.add("shake-error");
    }

    // Atualiza SVG do paciente e monitor multiparamétrico
    window.patientRenderer?.render(window.gameState);
    window.vitalMonitor?.update(window.gameState);

    // Exibe o painel pedagógico de feedback
    this.exibirFeedbackEscolha(opcao, etapa);
  }

  exibirFeedbackEscolha(opcao, etapa) {
    const container = document.getElementById("casoFeedbackCard");
    if (!container) return;

    const tipoClasse = opcao.tipo; // 'correta', 'parcial', 'errada'
    container.className = `feedback-escolha-container visible ${tipoClasse}`;
    container.style.display = "block";

    const iconeTipo = opcao.tipo === "correta" ? "✔" : opcao.tipo === "parcial" ? "◐" : "✖";
    const tituloTipo = opcao.tipo === "correta" ? "Conduta Adequada!" : opcao.tipo === "parcial" ? "Conduta Parcial" : "Conduta Inadequada";

    const html = `
      <div class="feedback-titulo">
        <span>${iconeTipo}</span>
        <span>${tituloTipo}</span>
      </div>
      <p style="font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.75rem;">
        ${opcao.feedback}
      </p>

      <!-- Cuidados de Enfermagem Fundamentais -->
      <div class="card-cuidados-enfermagem">
        <h4>📋 Cuidados de Enfermagem na Situação:</h4>
        <ul>
          ${etapa.cuidadosEnfermagem.map(c => `<li>${c}</li>`).join("")}
        </ul>
      </div>

      <!-- Para Fixar -->
      <div class="card-para-fixar" style="margin: 0.75rem 0;">
        <span>📌</span>
        <span><strong>Para fixar:</strong> "${etapa.paraFixar}"</span>
      </div>

      <!-- Curiosidade Você Sabia -->
      ${etapa.vocesabia ? `
        <div style="font-size: 0.85rem; color: var(--text-muted); background: var(--bg-card); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 0.75rem;">
          💡 <strong>Você sabia?</strong> ${etapa.vocesabia}
        </div>
      ` : ''}

      <!-- Botão Avançar -->
      <div style="text-align: right; margin-top: 1rem;">
        <button class="btn btn-primary" id="btnAvancarCasoEtapa">
          ${etapa.numero === 5 ? 'Ver Desfecho Final do Caso 🏁' : 'Avançar para a Próxima Etapa ➔'}
        </button>
      </div>
    `;

    container.innerHTML = html;

    // Scroll suave até o feedback
    container.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Evento do botão avançar
    document.getElementById("btnAvancarCasoEtapa")?.addEventListener("click", () => {
      if (etapa.numero < 5) {
        window.gameState.etapaAtualIndex++;
        this.renderEtapaCaso(window.gameState.etapaAtualIndex);
      } else {
        // Conclui o caso e exibe tela final
        this.exibirTelaFinal();
      }
    });
  }

  // Uso de dica da Gota durante a etapa
  acionarDicaGota() {
    if (window.gameState.dicasRestantes <= 0) return;

    const etapas = window.CLINICAL_DATA?.casoClinico?.etapas || [];
    const etapa = etapas[window.gameState.etapaAtualIndex];
    if (!etapa) return;

    // Procura uma opção errada ou parcial ainda não desabilitada
    const erradas = etapa.opcoes.filter(o => o.tipo !== "correta");
    const opcaoDesabilitar = erradas[Math.floor(Math.random() * erradas.length)];

    if (opcaoDesabilitar) {
      const btn = document.getElementById(`btnOpcao_${opcaoDesabilitar.id}`);
      if (btn) {
        btn.classList.add("desabilitada-dica");
      }
    }

    // Deduz dica no estado
    window.gameState.usarDica();

    // Atualiza contador
    const dicasText = document.getElementById("dicasRestantesNum");
    if (dicasText) dicasText.textContent = window.gameState.dicasRestantes;
    if (window.gameState.dicasRestantes <= 0) {
      const btnDica = document.getElementById("btnUsarDicaGota");
      if (btnDica) btnDica.disabled = true;
    }

    // Modal ou fala da Gota com a pista
    this.abrirModalGenerico(
      "💧 Dica da Gota",
      `<div class="mascote-gota-card">
        <div class="mascote-gota-avatar">
          <svg viewBox="0 0 64 64"><use href="#svgGotaMascoteBase"></use></svg>
        </div>
        <div class="mascote-fala">
          <h4 class="mascote-fala-titulo">Atenção, Enfermeiro(a)!</h4>
          <p class="mascote-fala-texto">${etapa.opcoes.find(o => o.tipo === 'correta')?.dicaGota || 'Analise a prioridade do XABCDE e evite atrasar o tratamento!'}</p>
          <p style="font-size: 0.8rem; color: var(--coral-red); margin-top: 0.4rem;"><em>(Eliminei uma alternativa arriscada para você!)</em></p>
        </div>
      </div>`
    );
  }

  // ==========================================================================
  // TELA FINAL DO CASO CLÍNICO
  // ==========================================================================
  exibirTelaFinal() {
    const resultado = window.gameState.calcularFinal();
    this.mostrarTela("telaFinalCaso");

    const container = document.getElementById("finalCasoContentArea");
    if (!container) return;

    // Disparar confetes se Final 1
    if (resultado.chave === "final1") {
      this.dispararConfetes();
    }

    const estrelasHtml = Array(3).fill(0).map((_, i) => {
      return i < resultado.estrelas ? '⭐' : '☆';
    }).join("");

    const nomeTratado = window.gameState.nomeJogador ? `Enf. ${window.gameState.nomeJogador}` : "Enfermeiro(a)";

    const html = `
      <div class="final-screen-card" style="border-color: ${resultado.cor};">
        <span class="final-badge" style="background: ${resultado.cor}22; color: ${resultado.cor};">
          ${resultado.classificacao}
        </span>
        <h2 style="color: ${resultado.cor}; font-size: 1.8rem; margin: 0.4rem 0;">${resultado.titulo}</h2>
        <p style="font-size: 1.1rem; color: var(--text-muted);">${resultado.subtitulo}</p>

        <!-- Estrelas -->
        <div class="estrelas-avaliacao">${estrelasHtml}</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--navy-blue); margin-bottom: 1.25rem;">
          Pontuação Clínica: ${resultado.pontos} de ${resultado.maxPontos} pontos 
          ${resultado.dicasUsadas > 0 ? `(${resultado.dicasUsadas} dica(s) utilizada(s))` : '(Sem uso de dicas!)'}
        </div>

        <!-- Mensagem de Conclusão -->
        <div style="max-width: 720px; margin: 0 auto 1.5rem; text-align: left; background: var(--bg-card-alt); padding: 1.25rem; border-radius: var(--radius-md); border-left: 5px solid ${resultado.cor}; line-height: 1.6;">
          <p><strong>Parabéns pelo empenho, ${nomeTratado}!</strong></p>
          <p>${resultado.mensagem}</p>
          <p style="margin-bottom: 0;"><em>${resultado.estadoFinalDesc}</em></p>
        </div>

        <!-- 1. Linha do Tempo das Escolhas -->
        <h3 style="color: var(--navy-blue); margin-top: 1.75rem;">📋 Linha do Tempo das Decisões de Enfermagem</h3>
        <div class="timeline-escolhas-grid">
          ${window.gameState.historicoEscolhas.map((item, idx) => {
            const icon = item.tipo === "correta" ? "✔ Correta (+2)" : item.tipo === "parcial" ? "◐ Parcial (+1)" : "✖ Inadequada (0)";
            const borda = item.tipo === "correta" ? "var(--aqua-green)" : item.tipo === "parcial" ? "var(--yellow-gold)" : "var(--coral-red)";
            return `
              <div class="timeline-item-card" style="border-top: 3px solid ${borda};">
                <strong>Etapa ${idx + 1}</strong>
                <div style="color: ${borda}; font-weight: 700; margin: 0.2rem 0;">${icon}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Opção escolhida: ${item.opcaoId}</div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- 2. Plano Sistematizado de Cuidados de Enfermagem -->
        <div style="text-align: left; margin: 2rem 0; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
          <h3 style="color: var(--coral-red); margin-bottom: 0.25rem;">${window.CLINICAL_DATA?.planoCuidados?.titulo}</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
            <em>${window.CLINICAL_DATA?.planoCuidados?.notaAcademica}</em>
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${window.CLINICAL_DATA?.planoCuidados?.diagnosticos?.map(diag => `
              <div style="background: var(--bg-card-alt); border-radius: var(--radius-sm); padding: 0.85rem; border-left: 3px solid var(--navy-blue);">
                <h4 style="color: var(--navy-blue); font-size: 0.95rem; margin-bottom: 0.25rem;">🎯 Diagnóstico: ${diag.titulo}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;"><strong>Fator relacionado:</strong> ${diag.evidenciadoPor}</p>
                <div style="font-size: 0.85rem;"><strong>Intervenções principais:</strong></div>
                <ul style="padding-left: 1.2rem; font-size: 0.82rem; margin-bottom: 0.4rem;">
                  ${diag.intervencoes.map(int => `<li>${int}</li>`).join("")}
                </ul>
                <div style="font-size: 0.82rem; color: var(--aqua-green-dark);"><strong>Resultado Esperado:</strong> ${diag.resultadosEsperados}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- 3. Complicações Tardias a Monitorar (Saleh et al. 2024) -->
        <div style="text-align: left; margin: 1.5rem 0; background: var(--coral-red-light); border: 2px solid var(--coral-red); border-radius: var(--radius-md); padding: 1.25rem;">
          <h3 style="color: var(--coral-red); margin-bottom: 0.2rem;">${window.CLINICAL_DATA?.planoCuidados?.complicacoesTardias?.titulo}</h3>
          <p style="font-size: 0.8rem; color: #5A121A; margin-bottom: 0.75rem;"><em>${window.CLINICAL_DATA?.planoCuidados?.complicacoesTardias?.apoio}</em></p>
          <ul style="padding-left: 1.25rem; font-size: 0.85rem; line-height: 1.5;">
            ${window.CLINICAL_DATA?.planoCuidados?.complicacoesTardias?.itens?.map(comp => `
              <li><strong>${comp.nome}:</strong> ${comp.desc}</li>
            `).join("")}
          </ul>
        </div>

        <!-- 4. O Que Aprendemos (Os 5 Para Fixar) -->
        <div style="text-align: left; margin: 1.5rem 0;">
          <h3 style="color: var(--navy-blue); margin-bottom: 0.75rem;">📌 Síntese das Lições do Caso</h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${window.CLINICAL_DATA?.casoClinico?.etapas?.map((et, idx) => `
              <div class="card-para-fixar" style="margin: 0;">
                <span>Etapa ${idx + 1}:</span>
                <span>"${et.paraFixar}"</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Ações Finais -->
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
          <button class="btn btn-primary" id="btnJogarNovamente">🔄 Jogar Novamente</button>
          <button class="btn btn-secondary" id="btnVerCreditosEquipe">👥 Ver Equipe e Referências</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Eventos
    document.getElementById("btnJogarNovamente")?.addEventListener("click", () => {
      window.gameState.reiniciarCaso();
      this.iniciarCasoClinico();
    });

    document.getElementById("btnVerCreditosEquipe")?.addEventListener("click", () => {
      const secao = document.getElementById("secaoEquipeReferencias");
      secao?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Dispara confetes leves na tela
  dispararConfetes() {
    const container = document.createElement("div");
    container.className = "confetti-container";
    const cores = ["#E63946", "#2EC4B6", "#FFD166", "#1D2B53", "#FF85A1"];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 1.5}s`;
      container.appendChild(piece);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4500);
  }

  // ==========================================================================
  // MODAIS E MINI-ANIMAÇÕES PEDAGÓGICAS ("ENTENDA A SITUAÇÃO")
  // ==========================================================================
  abrirModalEntendaSituacao(etapaIndex) {
    const etapas = window.CLINICAL_DATA?.casoClinico?.etapas || [];
    const etapa = etapas[etapaIndex];
    if (!etapa) return;

    const animSvg = this.gerarMiniAnimacaoSvg(etapa.miniAnimacao);

    const corpoModal = `
      <div style="margin-bottom: 1rem;">
        <h4 style="color: var(--coral-red); margin-bottom: 0.35rem;">${etapa.miniAnimacaoTitulo}</h4>
        <p style="font-size: 0.95rem; line-height: 1.5;">${etapa.contexto}</p>
      </div>

      <div style="background: var(--bg-card-alt); border: 2px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; text-align: center; margin-bottom: 1rem;">
        ${animSvg}
        <p style="font-size: 0.85rem; color: var(--navy-blue); font-weight: 700; margin-top: 0.6rem;">${etapa.miniAnimacaoDesc}</p>
      </div>

      <div class="card-para-fixar" style="margin: 0.5rem 0 0;">
        <span>📌</span>
        <span>${etapa.paraFixar}</span>
      </div>
    `;

    this.abrirModalGenerico("💡 Entenda a Situação Clínica", corpoModal);
  }

  gerarMiniAnimacaoSvg(idAnim) {
    if (idAnim === "cinta-pelvica") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- Bacia óssea estilizada -->
          <path d="M 50 40 Q 100 20 150 40 Q 170 70 140 90 Q 100 80 60 90 Q 30 70 50 40 Z" fill="#E2E8F0" stroke="#718096" stroke-width="3"/>
          <circle cx="85" cy="55" r="12" fill="#FFFFFF" stroke="#718096" stroke-width="2"/>
          <circle cx="115" cy="55" r="12" fill="#FFFFFF" stroke="#718096" stroke-width="2"/>
          <!-- Cinta fechando animada -->
          <rect x="40" y="58" width="120" height="16" rx="4" fill="#1D2B53" stroke="#2EC4B6" stroke-width="2"/>
          <line x1="30" y1="66" x2="170" y2="66" stroke="#FFD166" stroke-width="3" class="pelvic-belt-path"/>
          <text x="100" y="112" font-family="'Nunito', sans-serif" font-weight="800" font-size="10" fill="#1D2B53" text-anchor="middle">REDUÇÃO DE VOLUME DA PELVE</text>
        </svg>
      `;
    }

    if (idAnim === "triade-letal") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- 3 Engrenagens conectadas -->
          <g transform="translate(60, 45)" class="gear-cw">
            <circle cx="0" cy="0" r="22" fill="#48CAE4"/>
            <text x="0" y="4" font-size="7" font-weight="800" fill="#FFFFFF" text-anchor="middle">HIPOTERMIA</text>
          </g>
          <g transform="translate(140, 45)" class="gear-ccw">
            <circle cx="0" cy="0" r="22" fill="#E63946"/>
            <text x="0" y="4" font-size="7" font-weight="800" fill="#FFFFFF" text-anchor="middle">ACIDOSE</text>
          </g>
          <g transform="translate(100, 85)" class="gear-cw">
            <circle cx="0" cy="0" r="22" fill="#FFD166"/>
            <text x="0" y="4" font-size="6.5" font-weight="800" fill="#1D2B53" text-anchor="middle">COAGULOPATIA</text>
          </g>
        </svg>
      `;
    }

    if (idAnim === "fast-negativo") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- Abdome Livre vs Retroperitônio -->
          <rect x="25" y="20" width="70" height="70" rx="8" fill="#EBF8FF" stroke="#3182CE" stroke-width="2"/>
          <text x="60" y="55" font-size="8.5" font-weight="800" fill="#2B6CB0" text-anchor="middle">PERITÔNIO</text>
          <text x="60" y="70" font-size="8" fill="#38A169" text-anchor="middle">FAST Negativo ✔</text>

          <rect x="105" y="20" width="70" height="70" rx="8" fill="#FFF5F5" stroke="#E53E3E" stroke-width="2"/>
          <text x="140" y="50" font-size="8" font-weight="800" fill="#9B2C2C" text-anchor="middle">RETROPERITÔNIO</text>
          <circle cx="140" cy="70" r="14" fill="#E63946" opacity="0.85"/>
          <text x="140" y="73" font-size="7" font-weight="800" fill="#FFFFFF" text-anchor="middle">SANGUE OCULTO</text>
        </svg>
      `;
    }

    if (idAnim === "transfusao-segura") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- Bolsa + Pulseira + Duplo Check -->
          <rect x="35" y="25" width="40" height="60" rx="6" fill="#8B0000" stroke="#FFFFFF" stroke-width="2"/>
          <rect x="42" y="35" width="26" height="20" rx="2" fill="#FFFFFF"/>
          <text x="55" y="48" font-size="8" font-weight="800" fill="#8B0000" text-anchor="middle">CH O+</text>

          <rect x="110" y="45" width="55" height="22" rx="4" fill="#FFFFFF" stroke="#1D2B53" stroke-width="2"/>
          <text x="137" y="59" font-size="8" font-weight="800" fill="#1D2B53" text-anchor="middle">LUCAS O+</text>

          <!-- Selo Dupla Checagem -->
          <circle cx="95" cy="55" r="14" fill="#2EC4B6"/>
          <text x="95" y="59" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✔✔</text>
          <text x="100" y="105" font-size="9" font-weight="800" fill="#1D2B53" text-anchor="middle">DUPLA CHECAGEM À BEIRA DO LEITO</text>
        </svg>
      `;
    }

    if (idAnim === "uretra") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- Bexiga e Uretra com sinal de Pare -->
          <ellipse cx="100" cy="35" rx="30" ry="20" fill="#FEFCBF" stroke="#D69E2E" stroke-width="2"/>
          <line x1="100" y1="55" x2="100" y2="85" stroke="#E53E3E" stroke-width="5" stroke-dasharray="6 3"/>
          
          <!-- Placa de Pare -->
          <polygon points="100,68 115,75 115,90 100,97 85,90 85,75" fill="#E63946"/>
          <text x="100" y="86" font-size="8" font-weight="800" fill="#FFFFFF" text-anchor="middle">PARE!</text>
          <text x="100" y="112" font-size="9" font-weight="800" fill="#E63946" text-anchor="middle">NÃO SONDAR ÀS CEGAS</text>
        </svg>
      `;
    }

    return `<div style="padding: 1rem; color: var(--navy-blue);">Conceito clínico chave ilustrado.</div>`;
  }

  // Modal genérico reutilizável
  abrirModalGenerico(titulo, conteudoHtml) {
    const backdrop = document.getElementById("modalBackdrop");
    const tituloEl = document.getElementById("modalHeaderTitle");
    const corpoEl = document.getElementById("modalBodyContent");

    if (!backdrop || !tituloEl || !corpoEl) return;

    tituloEl.textContent = titulo;
    corpoEl.innerHTML = conteudoHtml;

    backdrop.classList.add("open");
    backdrop.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  fecharModal() {
    const backdrop = document.getElementById("modalBackdrop");
    if (backdrop) {
      backdrop.classList.remove("open");
      backdrop.setAttribute("hidden", "true");
      document.body.style.overflow = "";
    }
  }

  // Modal Consulta Rápida (Glossário + Tabela das 4 Classes)
  abrirModalConsultaRapida() {
    const cr = window.CLINICAL_DATA?.consultaRapida;
    if (!cr) return;

    const html = `
      <div class="modal-tabs">
        <button class="tab-btn active" id="tabBtnGlossario">📖 Glossário de Termos</button>
        <button class="tab-btn" id="tabBtnClassesHemo">📊 Classes de Hemorragia</button>
      </div>

      <!-- Conteúdo da Aba 1: Glossário -->
      <div id="tabConteudoGlossario" style="margin-top: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          ${cr.glossario.map(g => `
            <div style="background: var(--bg-card-alt); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--coral-red);">
              <strong style="color: var(--navy-blue); font-size: 0.95rem;">${g.termo}:</strong>
              <p style="font-size: 0.85rem; margin: 0.15rem 0 0; line-height: 1.4;">${g.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Conteúdo da Aba 2: Classes de Hemorragia -->
      <div id="tabConteudoClassesHemo" style="margin-top: 1rem; display: none;">
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;"><em>${cr.classesHemorragia.nota}</em></p>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
            <thead>
              <tr style="background: var(--navy-blue); color: #FFFFFF;">
                <th style="padding: 0.5rem;">Classe</th>
                <th style="padding: 0.5rem;">Perda Sanguínea</th>
                <th style="padding: 0.5rem;">FC (bpm)</th>
                <th style="padding: 0.5rem;">PA</th>
                <th style="padding: 0.5rem;">FR (irpm)</th>
                <th style="padding: 0.5rem;">Sensório</th>
              </tr>
            </thead>
            <tbody>
              ${cr.classesHemorragia.tabela.map((row, i) => `
                <tr style="background: ${i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-card-alt)'}; border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.5rem; font-weight: 700; color: var(--coral-red);">${row.classe}</td>
                  <td style="padding: 0.5rem;">${row.perda}</td>
                  <td style="padding: 0.5rem;">${row.fc}</td>
                  <td style="padding: 0.5rem;">${row.pa}</td>
                  <td style="padding: 0.5rem;">${row.fr}</td>
                  <td style="padding: 0.5rem;">${row.mental}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.abrirModalGenerico("🔍 Consulta Rápida da Sala Vermelha", html);

    // Abas
    document.getElementById("tabBtnGlossario")?.addEventListener("click", () => {
      document.getElementById("tabBtnGlossario").classList.add("active");
      document.getElementById("tabBtnClassesHemo").classList.remove("active");
      document.getElementById("tabConteudoGlossario").style.display = "block";
      document.getElementById("tabConteudoClassesHemo").style.display = "none";
    });

    document.getElementById("tabBtnClassesHemo")?.addEventListener("click", () => {
      document.getElementById("tabBtnClassesHemo").classList.add("active");
      document.getElementById("tabBtnGlossario").classList.remove("active");
      document.getElementById("tabConteudoClassesHemo").style.display = "block";
      document.getElementById("tabConteudoGlossario").style.display = "none";
    });
  }

  // Modal Como Jogar
  abrirModalComoJogar() {
    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <h4 style="color: var(--coral-red); margin-bottom: 0.4rem;">Bem-vindo(a) ao Plantão da Sala Vermelha!</h4>
        <p>Este aplicativo interativo foi desenvolvido para o seminário de <strong>Patologia Geral do 4º período de Enfermagem da FAC</strong>, orientado pela <strong>Profa. Paula Silveira</strong>.</p>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin: 1rem 0;">
          <div style="background: var(--bg-card-alt); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--aqua-green);">
            <strong>1. Trilha de Aprendizado (6 Paradas):</strong>
            <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">Descubra a definição, etiologia, fisiopatologia, sinais clínicos, exames diagnósticos e a prioridade do XABCDE com minijogos práticos.</p>
          </div>

          <div style="background: var(--bg-card-alt); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--coral-red);">
            <strong>2. Caso Clínico Interativo (O Jogo):</strong>
            <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">Você atende Lucas (28a), vítima de politrauma com fratura pélvica instável. Suas condutas alteram os sinais vitais, cor da pele, hematoma e volume em tempo real!</p>
          </div>

          <div style="background: var(--bg-card-alt); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--yellow-dark);">
            <strong>3. Dicas da Gota:</strong>
            <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">Você dispõe de 2 dicas por partida. Cada dica descarta uma conduta arriscada e fornece uma pista clínica valiosa.</p>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0;">
          ⌨️ <strong>Teclas de Atalho no Seminário:</strong> Use [←] e [→] para navegar e [F] para tela cheia.
        </p>
      </div>
    `;
    this.abrirModalGenerico("ℹ️ Como Funciona a Sala Vermelha", html);
  }

  // Renderiza a seção de equipe, referências e aviso legal
  renderEquipeEReferencias() {
    const container = document.getElementById("secaoEquipeReferencias");
    if (!container) return;

    const eq = window.CLINICAL_DATA?.equipe;
    const refs = window.CLINICAL_DATA?.referencias;
    const aviso = window.CLINICAL_DATA?.avisoAcademico;

    const html = `
      <div class="section-equipe-wrapper">
        <h2 class="section-title">Quem Faz a Sala Vermelha</h2>
        <p class="section-subtitle">Seminário Tipos de Choque • Enfermagem (4º período) • FAC Curvelo</p>

        <!-- Banner Institucional da Faculdade -->
        <div class="faculdade-banner">
          <img src="/__l5e/assets-v1/75266d4a-3f22-4e3d-a0f0-e4518827bf29/fac-curvelo.png" alt="FAC — Faculdade Arquidiocesana de Curvelo" class="logo-fac-img" onerror="this.onerror=null; this.src='/__l5e/assets-v1/75266d4a-3f22-4e3d-a0f0-e4518827bf29/fac-curvelo.png';">
          <div style="text-align: left;">
            <h4 style="color: var(--navy-blue); margin-bottom: 0.1rem;">FAC — Faculdade Arquidiocesana de Curvelo</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0;">Curso de Bacharelado em Enfermagem • Curvelo, MG</p>
          </div>
        </div>

        <!-- Card da Professora Orientadora -->
        <div class="orientadora-card">
          <div class="orientadora-avatar">
            ${eq.orientadora.iniciais}
          </div>
          <div>
            <span class="btn-text-badge" style="font-size: 0.75rem; margin-bottom: 0.25rem;">${eq.orientadora.titulacao}</span>
            <h3 style="color: var(--navy-blue); font-size: 1.25rem; margin-bottom: 0.2rem;">${eq.orientadora.nome}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0;">Disciplina: ${eq.orientadora.disciplina}</p>
          </div>
        </div>

        <!-- Grade com os 7 Alunos da Equipe -->
        <h3 style="text-align: center; color: var(--navy-blue); margin-bottom: 1.25rem;">Integrantes da Equipe</h3>
        <div class="equipe-grid">
          ${eq.integrantes.map(m => `
            <div class="membro-card">
              <div class="membro-avatar">
                ${m.iniciais}
              </div>
              <div class="membro-info">
                <h4>${m.nome}</h4>
                <p>${m.curso}</p>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Referências em ABNT -->
        <div class="referencias-box">
          <h3>📚 Referências Bibliográficas (ABNT)</h3>
          <ul class="referencias-lista">
            ${refs.map(r => `
              <li><strong>[${r.tipo}]</strong> ${r.citacao}</li>
            `).join("")}
          </ul>
        </div>

        <!-- Aviso Acadêmico -->
        <div class="aviso-academico-card">
          <strong>⚖️ Aviso Acadêmico e Institucional:</strong><br>
          ${aviso}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.uiManager = new UIManager();
}

/**
 * MAIN.JS — Orquestrador principal da aplicação Sala Vermelha
 * Inicialização, escuta de eventos globais, atalhos do seminário e ciclo de vida
 */

window.initializeSala = () => {
  // 1. Inicializar renderizadores
  window.patientRenderer = new PatientRenderer("patientSceneBox");
  window.vitalMonitor = new VitalMonitor("vitalMonitorPanel", "ecgCanvasMonitor");

  // Inscrever monitor e paciente nas mudanças de estado
  window.gameState.listeners = [];
  window.gameState.subscribe((state) => {
    window.uiManager?.atualizarBarraProgresso();
    if (window.uiManager?.telaAtualId === "telaCasoClinico") {
      window.patientRenderer?.render(state);
      window.vitalMonitor?.update(state);
    }
  });

  // 2. Renderizar equipe e referências no rodapé
  window.uiManager.renderEquipeEReferencias();

  // 3. Restaurar preferências salvas
  restaurarPreferencias();

  // 4. Vincular eventos dos botões da Home e do Cabeçalho
  bindGlobalEvents();

  // 5. Inicializar na Tela Home
  window.uiManager.mostrarTela("telaHome");
};

function restaurarPreferencias() {
  const nomeInput = document.getElementById("inputNomeEnfermeiro");
  if (nomeInput && window.gameState.nomeJogador) {
    nomeInput.value = window.gameState.nomeJogador;
  }

  // Restaurar modo apresentação se estava ativo
  if (window.gameState.prefs?.modoApresentacao) {
    document.body.classList.add("modo-apresentacao");
    document.getElementById("legacy_btnToggleApresentacao")?.classList.add("active");
  }

  // Restaurar som
  if (window.gameState.prefs?.somAtivo) {
    window.vitalMonitor.toggleAudio(true);
    const btnSom = document.getElementById("legacy_btnToggleAudio");
    if (btnSom) btnSom.textContent = "🔊";
  }
}

function bindGlobalEvents() {
  // Navegação da Marca / Logo
  document.getElementById("legacy_brandLogoLink")?.addEventListener("click", () => {
    window.uiManager.mostrarTela("telaHome");
  });

  // Botões do Cabeçalho
  document.getElementById("legacy_btnNavMapa")?.addEventListener("click", () => {
    window.uiManager.mostrarTela("telaMapaTrilha");
  });

  document.getElementById("legacy_btnNavConsultaRapida")?.addEventListener("click", () => {
    window.uiManager.abrirModalConsultaRapida();
  });

  // Alternador de Som (Bip do Monitor)
  const btnAudio = document.getElementById("legacy_btnToggleAudio");
  btnAudio?.addEventListener("click", () => {
    const ativo = window.vitalMonitor.toggleAudio();
    btnAudio.textContent = ativo ? "🔊" : "🔇";
    window.gameState.prefs.somAtivo = ativo;
    window.gameState.savePreferences();
  });

  // Alternador de Tema Claro / Escuro
  document.getElementById("btnToggleTema")?.addEventListener("click", () => {
    const atual = document.documentElement.getAttribute("data-theme");
    const novo = atual === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", novo);
    localStorage.setItem("sala_vermelha_tema", novo);
  });

  // Alternador do Modo Apresentação (Projetor 16:9)
  const btnApres = document.getElementById("legacy_btnToggleApresentacao");
  const alternarModoApresentacao = () => {
    const ativo = document.body.classList.toggle("modo-apresentacao");
    btnApres?.classList.toggle("active", ativo);
    window.gameState.prefs.modoApresentacao = ativo;
    window.gameState.savePreferences();
  };
  btnApres?.addEventListener("click", alternarModoApresentacao);
  document.getElementById("legacy_btnHeroApresentacao")?.addEventListener("click", alternarModoApresentacao);

  // Botões da Tela Inicial (Hero)
  const nomeInput = document.getElementById("inputNomeEnfermeiro");
  const salvarNome = () => {
    if (nomeInput) {
      window.gameState.nomeJogador = nomeInput.value.trim();
      window.gameState.savePreferences();
    }
  };

  document.getElementById("legacy_btnHeroIniciarTrilha")?.addEventListener("click", () => {
    salvarNome();
    window.uiManager.mostrarTela("telaMapaTrilha");
  });

  document.getElementById("legacy_btnHeroPularCaso")?.addEventListener("click", () => {
    salvarNome();
    window.uiManager.iniciarCasoClinico();
  });

  document.getElementById("legacy_btnHeroComoJogar")?.addEventListener("click", () => {
    window.uiManager.abrirModalComoJogar();
  });

  document.getElementById("legacy_btnHeroConsultaRapida")?.addEventListener("click", () => {
    window.uiManager.abrirModalConsultaRapida();
  });

  // Eventos do Caso Clínico
  document.getElementById("btnEntendaSituacao")?.addEventListener("click", () => {
    window.uiManager.abrirModalEntendaSituacao(window.gameState.etapaAtualIndex);
  });

  document.getElementById("btnUsarDicaGota")?.addEventListener("click", () => {
    window.uiManager.acionarDicaGota();
  });

  // Fechamento de Modais
  document.getElementById("modalBtnClose")?.addEventListener("click", () => {
    window.uiManager.fecharModal();
  });

  document.getElementById("modalBtnOk")?.addEventListener("click", () => {
    window.uiManager.fecharModal();
  });

  document.getElementById("modalBackdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "modalBackdrop") {
      window.uiManager.fecharModal();
    }
  });

  // Atalhos de Teclado (Acessibilidade e Seminário)
  document.removeEventListener("keydown", window.salaKeyHandler);
  window.salaKeyHandler = (e) => {
    // Tecla Esc fecha modais
    if (e.key === "Escape") {
      window.uiManager.fecharModal();
      return;
    }

    // Tecla F alterna fullscreen
    if ((e.key === "f" || e.key === "F") && !isInputElement(e.target)) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      return;
    }

    // Teclas de seta no Modo Apresentação ou Trilha
    if (e.key === "ArrowRight" && !isInputElement(e.target)) {
      navegarParaFrente();
    } else if (e.key === "ArrowLeft" && !isInputElement(e.target)) {
      navegarParaTras();
    }
  };
  document.addEventListener("keydown", window.salaKeyHandler);
}

function isInputElement(el) {
  return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
}

function navegarParaFrente() {
  if (window.uiManager.telaAtualId === "telaParadaTeorica") {
    if (window.trilhaManager.paradaAtual < 6) {
      window.trilhaManager.renderParada(window.trilhaManager.paradaAtual + 1);
    } else {
      window.uiManager.iniciarCasoClinico();
    }
  } else if (window.uiManager.telaAtualId === "telaHome") {
    window.uiManager.mostrarTela("telaMapaTrilha");
  }
}

function navegarParaTras() {
  if (window.uiManager.telaAtualId === "telaParadaTeorica") {
    if (window.trilhaManager.paradaAtual > 1) {
      window.trilhaManager.renderParada(window.trilhaManager.paradaAtual - 1);
    } else {
      window.uiManager.mostrarTela("telaMapaTrilha");
    }
  }
}

})();