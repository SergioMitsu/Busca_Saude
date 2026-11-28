/**
 * BuscaSaúde · script.js v2.2.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Script auto-contido e compatível com abertura direta via arquivo local (file://)
 * e servidores HTTP (Live Server, Node, etc.).
 *
 * Módulos integrados:
 * - ModuloAcessibilidade (Escala tipográfica A-/A/A+, Alto Contraste, ARIA)
 * - ModuloMascote (Dra. Nina: animação de sprites, piscada natural, fala TTS)
 * - ModuloBusca (Pesquisa com prioridade em princípio ativo, nomes comerciais,
 *   medicamentos compostos, controle legal da receita de antibióticos 10 dias)
 * - Base completa de dados de saúde (RENAME / SMS-SP simulada)
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

// ═════════════════════════════════════════════════════════════════════════════
// 1. DADOS DE SAÚDE EMBUTIDOS (GARANTE FUNCIONAMENTO EM FILE:// E OFFLINE)
// ═════════════════════════════════════════════════════════════════════════════
const DADOS_SAUDE_EMBUTIDOS = {
  "metadata": {
    "fonte": "Simulação baseada na RENAME / Secretaria Municipal de Saúde de São Paulo (SMS-SP)",
    "atualizacao": "2026-06-01",
    "versao": "2.1.0",
    "aviso_legal": "Dados simulados estritamente para fins de prototipagem acadêmica (FMU Tech Inovação - ODS 3)"
  },
  "medicamentos": [
    {
      "id": "med001",
      "nome": "Amoxicilina",
      "nome_generico": "Amoxicilina Tri-hidratada",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Amoxil",
        "Novocilin",
        "Velamox"
      ],
      "apresentacao": "500mg · Cápsula",
      "categoria": "Antibiótico",
      "validade_receita_dias": 10,
      "alerta_seguranca": "Atenção: Receita de antibióticos válida por 10 dias (RDC 471/2021 Anvisa).",
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs001",
          "zona": "Oeste",
          "nome": "UBS Dr. José Leão – Vila Madalena",
          "endereco": "Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP",
          "cep": "05417-011",
          "telefone": "(11) 3812-4400",
          "horario": "Segunda a Sexta: 07h às 19h\nSábado: 07h às 13h",
          "coordenadas": {
            "lat": -23.5558,
            "lng": -46.6975
          },
          "estoque_percentual": 75,
          "obs": "Documentos necessários: RG, Cartão SUS e Receita (máx. 10 dias)."
        },
        {
          "id": "ubs002",
          "zona": "Centro",
          "nome": "UBS Jardim Paulista",
          "endereco": "Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP",
          "cep": "01403-001",
          "telefone": "(11) 3255-5800",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5715,
            "lng": -46.6543
          },
          "estoque_percentual": 90,
          "obs": "Retirada na farmácia mediante receita médica válida."
        },
        {
          "id": "ubs005",
          "zona": "Centro",
          "nome": "UBS Bela Vista – Centro",
          "endereco": "Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP",
          "cep": "01401-000",
          "telefone": "(11) 3107-2200",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.5618,
            "lng": -46.6549
          },
          "estoque_percentual": 55,
          "obs": "Estoque moderado. Recomenda-se buscar nos próximos dias."
        },
        {
          "id": "ubs007",
          "zona": "Leste",
          "nome": "UBS Itaquera – Zona Leste",
          "endereco": "Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP",
          "cep": "08230-010",
          "telefone": "(11) 2074-5300",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5342,
            "lng": -46.4475
          },
          "estoque_percentual": 40,
          "obs": "Estoque baixo. Confirme por telefone antes de se deslocar."
        }
      ]
    },
    {
      "id": "med002",
      "nome": "Dipirona",
      "nome_generico": "Dipirona Monoidratada",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Novalgina",
        "Anador",
        "Magnopyrol",
        "Baralgina M"
      ],
      "apresentacao": "500mg · Comprimido",
      "categoria": "Analgésico / Antitérmico",
      "validade_receita_dias": 30,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs001",
          "zona": "Oeste",
          "nome": "UBS Dr. José Leão – Vila Madalena",
          "endereco": "Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP",
          "cep": "05417-011",
          "telefone": "(11) 3812-4400",
          "horario": "Segunda a Sexta: 07h às 19h\nSábado: 07h às 13h",
          "coordenadas": {
            "lat": -23.5558,
            "lng": -46.6975
          },
          "estoque_percentual": 95,
          "obs": "Disponível para retirada imediata."
        },
        {
          "id": "ubs003",
          "zona": "Norte",
          "nome": "UBS Santana – Zona Norte",
          "endereco": "Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP",
          "cep": "02011-001",
          "telefone": "(11) 2973-5600",
          "horario": "Segunda a Sexta: 07h às 17h\nSábado: 08h às 12h",
          "coordenadas": {
            "lat": -23.5014,
            "lng": -46.6226
          },
          "estoque_percentual": 80,
          "obs": "Disponível na farmácia da unidade."
        },
        {
          "id": "ubs006",
          "zona": "Oeste",
          "nome": "UBS Lapa – Zona Oeste",
          "endereco": "Rua Catão, 428 – Lapa, São Paulo – SP",
          "cep": "05049-000",
          "telefone": "(11) 3641-7700",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.5314,
            "lng": -46.7008
          },
          "estoque_percentual": 60,
          "obs": "Verifique a disponibilidade por telefone."
        },
        {
          "id": "ubs007",
          "zona": "Leste",
          "nome": "UBS Itaquera – Zona Leste",
          "endereco": "Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP",
          "cep": "08230-010",
          "telefone": "(11) 2074-5300",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5342,
            "lng": -46.4475
          },
          "estoque_percentual": 88,
          "obs": "Amplo estoque. Atendimento ágil."
        }
      ]
    },
    {
      "id": "med003",
      "nome": "Losartana",
      "nome_generico": "Losartana Potássica",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Cozaar",
        "Aradois",
        "Losatec",
        "Corus",
        "Torlos"
      ],
      "apresentacao": "50mg · Comprimido",
      "categoria": "Anti-hipertensivo",
      "validade_receita_dias": 180,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs002",
          "zona": "Centro",
          "nome": "UBS Jardim Paulista",
          "endereco": "Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP",
          "cep": "01403-001",
          "telefone": "(11) 3255-5800",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5715,
            "lng": -46.6543
          },
          "estoque_percentual": 70,
          "obs": "Programa HIPERDIA disponível. Levar receita médica."
        },
        {
          "id": "ubs004",
          "zona": "Sul",
          "nome": "UBS Campo Limpo – Zona Sul",
          "endereco": "Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP",
          "cep": "05755-000",
          "telefone": "(11) 5841-9000",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.6485,
            "lng": -46.7627
          },
          "estoque_percentual": 85,
          "obs": "Cadastrado no Programa de Hipertensão."
        },
        {
          "id": "ubs008",
          "zona": "Sul",
          "nome": "UBS Santo Amaro – Zona Sul",
          "endereco": "Rua Amador Bueno, 536 – Santo Amaro, São Paulo – SP",
          "cep": "04752-005",
          "telefone": "(11) 5681-3200",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.65,
            "lng": -46.71
          },
          "estoque_percentual": 62,
          "obs": "Acompanhamento e dispensação contínua."
        }
      ]
    },
    {
      "id": "med004",
      "nome": "Metformina",
      "nome_generico": "Cloridrato de Metformina",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Glifage",
        "Dimefor",
        "Glucoformin",
        "Risidon"
      ],
      "apresentacao": "850mg · Comprimido",
      "categoria": "Antidiabético",
      "validade_receita_dias": 180,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs003",
          "zona": "Norte",
          "nome": "UBS Santana – Zona Norte",
          "endereco": "Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP",
          "cep": "02011-001",
          "telefone": "(11) 2973-5600",
          "horario": "Segunda a Sexta: 07h às 17h\nSábado: 08h às 12h",
          "coordenadas": {
            "lat": -23.5014,
            "lng": -46.6226
          },
          "estoque_percentual": 65,
          "obs": "Acompanhamento pelo programa de Diabetes."
        },
        {
          "id": "ubs004",
          "zona": "Sul",
          "nome": "UBS Campo Limpo – Zona Sul",
          "endereco": "Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP",
          "cep": "05755-000",
          "telefone": "(11) 5841-9000",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.6485,
            "lng": -46.7627
          },
          "estoque_percentual": 45,
          "obs": "Estoque moderado."
        },
        {
          "id": "ubs009",
          "zona": "Norte",
          "nome": "UBS Jaçanã – Zona Norte",
          "endereco": "Rua Jaçanã, 220 – Jaçanã, São Paulo – SP",
          "cep": "02270-010",
          "telefone": "(11) 2951-3300",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.47,
            "lng": -46.59
          },
          "estoque_percentual": 78,
          "obs": "Boa disponibilidade."
        }
      ]
    },
    {
      "id": "med005",
      "nome": "Atenolol",
      "nome_generico": "Atenolol",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Atenol",
        "Angipress",
        "Plenacor"
      ],
      "apresentacao": "25mg · Comprimido",
      "categoria": "Anti-hipertensivo (Betabloqueador)",
      "validade_receita_dias": 180,
      "disponivel": false,
      "ubs": []
    },
    {
      "id": "med006",
      "nome": "Omeprazol",
      "nome_generico": "Omeprazol",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Losec",
        "Peprazol",
        "Omepramix",
        "Gaspiren"
      ],
      "apresentacao": "20mg · Cápsula",
      "categoria": "Protetor gástrico / Antiácido",
      "validade_receita_dias": 30,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs005",
          "zona": "Centro",
          "nome": "UBS Bela Vista – Centro",
          "endereco": "Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP",
          "cep": "01401-000",
          "telefone": "(11) 3107-2200",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.5618,
            "lng": -46.6549
          },
          "estoque_percentual": 88,
          "obs": "Disponível mediante receita médica."
        },
        {
          "id": "ubs006",
          "zona": "Oeste",
          "nome": "UBS Lapa – Zona Oeste",
          "endereco": "Rua Catão, 428 – Lapa, São Paulo – SP",
          "cep": "05049-000",
          "telefone": "(11) 3641-7700",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.5314,
            "lng": -46.7008
          },
          "estoque_percentual": 72,
          "obs": "Disponível."
        },
        {
          "id": "ubs007",
          "zona": "Leste",
          "nome": "UBS Itaquera – Zona Leste",
          "endereco": "Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP",
          "cep": "08230-010",
          "telefone": "(11) 2074-5300",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5342,
            "lng": -46.4475
          },
          "estoque_percentual": 55,
          "obs": "Retirada regular."
        }
      ]
    },
    {
      "id": "med007",
      "nome": "Captopril",
      "nome_generico": "Captopril",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Capoten",
        "Hipocat"
      ],
      "apresentacao": "25mg · Comprimido",
      "categoria": "Anti-hipertensivo (IECA)",
      "validade_receita_dias": 180,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs004",
          "zona": "Sul",
          "nome": "UBS Campo Limpo – Zona Sul",
          "endereco": "Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP",
          "cep": "05755-000",
          "telefone": "(11) 5841-9000",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.6485,
            "lng": -46.7627
          },
          "estoque_percentual": 92,
          "obs": "Programa HIPERDIA."
        },
        {
          "id": "ubs008",
          "zona": "Sul",
          "nome": "UBS Santo Amaro – Zona Sul",
          "endereco": "Rua Amador Bueno, 536 – Santo Amaro, São Paulo – SP",
          "cep": "04752-005",
          "telefone": "(11) 5681-3200",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.65,
            "lng": -46.71
          },
          "estoque_percentual": 67,
          "obs": "Levar receita médica atualizada."
        }
      ]
    },
    {
      "id": "med008",
      "nome": "Ibuprofeno",
      "nome_generico": "Ibuprofeno",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Alivium",
        "Advil",
        "Buscofem",
        "Dalsy",
        "Spidufen"
      ],
      "apresentacao": "400mg · Comprimido",
      "categoria": "Anti-inflamatório / Analgésico",
      "validade_receita_dias": 30,
      "disponivel": false,
      "ubs": []
    },
    {
      "id": "med009",
      "nome": "Paracetamol",
      "nome_generico": "Paracetamol",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Tylenol",
        "Parador",
        "Dôrico"
      ],
      "apresentacao": "500mg · Comprimido",
      "categoria": "Analgésico / Antitérmico",
      "validade_receita_dias": 30,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs001",
          "zona": "Oeste",
          "nome": "UBS Dr. José Leão – Vila Madalena",
          "endereco": "Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP",
          "cep": "05417-011",
          "telefone": "(11) 3812-4400",
          "horario": "Segunda a Sexta: 07h às 19h\nSábado: 07h às 13h",
          "coordenadas": {
            "lat": -23.5558,
            "lng": -46.6975
          },
          "estoque_percentual": 94,
          "obs": "Disponível sem receita."
        },
        {
          "id": "ubs003",
          "zona": "Norte",
          "nome": "UBS Santana – Zona Norte",
          "endereco": "Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP",
          "cep": "02011-001",
          "telefone": "(11) 2973-5600",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5014,
            "lng": -46.6226
          },
          "estoque_percentual": 82,
          "obs": "Disponível na farmácia da unidade."
        },
        {
          "id": "ubs007",
          "zona": "Leste",
          "nome": "UBS Itaquera – Zona Leste",
          "endereco": "Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP",
          "cep": "08230-010",
          "telefone": "(11) 2074-5300",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5342,
            "lng": -46.4475
          },
          "estoque_percentual": 76,
          "obs": "Estoque regularizado."
        }
      ]
    },
    {
      "id": "med010",
      "nome": "Sinvastatina",
      "nome_generico": "Sinvastatina",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Zocor",
        "Sinvax",
        "Vaslip"
      ],
      "apresentacao": "20mg · Comprimido",
      "categoria": "Hipolipemiante (Colesterol)",
      "validade_receita_dias": 180,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs002",
          "zona": "Centro",
          "nome": "UBS Jardim Paulista",
          "endereco": "Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP",
          "cep": "01403-001",
          "telefone": "(11) 3255-5800",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5715,
            "lng": -46.6543
          },
          "estoque_percentual": 88,
          "obs": "Necessário receita médica."
        },
        {
          "id": "ubs008",
          "zona": "Sul",
          "nome": "UBS Santo Amaro – Zona Sul",
          "endereco": "Rua Amador Bueno, 536 – Santo Amaro, São Paulo – SP",
          "cep": "04752-005",
          "telefone": "(11) 5681-3200",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.65,
            "lng": -46.71
          },
          "estoque_percentual": 69,
          "obs": "Programa de prevenção cardiovascular."
        }
      ]
    },
    {
      "id": "med011",
      "nome": "Salbutamol",
      "nome_generico": "Sulfato de Salbutamol",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Aerolin",
        "Aerodini"
      ],
      "apresentacao": "100mcg/dose · Spray aerossol",
      "categoria": "Broncodilatador (Asma / DPOC)",
      "validade_receita_dias": 180,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs005",
          "zona": "Centro",
          "nome": "UBS Bela Vista – Centro",
          "endereco": "Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP",
          "cep": "01401-000",
          "telefone": "(11) 3107-2200",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.5618,
            "lng": -46.6549
          },
          "estoque_percentual": 85,
          "obs": "Disponível na farmácia."
        },
        {
          "id": "ubs004",
          "zona": "Sul",
          "nome": "UBS Campo Limpo – Zona Sul",
          "endereco": "Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP",
          "cep": "05755-000",
          "telefone": "(11) 5841-9000",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.6485,
            "lng": -46.7627
          },
          "estoque_percentual": 58,
          "obs": "Acompanhamento do programa respiratório."
        }
      ]
    },
    {
      "id": "med012",
      "nome": "Hidroclorotiazida",
      "nome_generico": "Hidroclorotiazida",
      "tipo_registro": "simples",
      "nomes_comerciais": [
        "Clorana",
        "Drenol"
      ],
      "apresentacao": "25mg · Comprimido",
      "categoria": "Diurético / Anti-hipertensivo",
      "validade_receita_dias": 180,
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs001",
          "zona": "Oeste",
          "nome": "UBS Dr. José Leão – Vila Madalena",
          "endereco": "Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP",
          "cep": "05417-011",
          "telefone": "(11) 3812-4400",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.5558,
            "lng": -46.6975
          },
          "estoque_percentual": 90,
          "obs": "Disponível no HIPERDIA."
        },
        {
          "id": "ubs002",
          "zona": "Centro",
          "nome": "UBS Jardim Paulista",
          "endereco": "Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP",
          "cep": "01403-001",
          "telefone": "(11) 3255-5800",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5715,
            "lng": -46.6543
          },
          "estoque_percentual": 75,
          "obs": "Disponível mediante receita médica."
        }
      ]
    },
    {
      "id": "med013",
      "nome": "Amoxicilina + Clavulanato",
      "nome_generico": "Amoxicilina Tri-hidratada + Clavulanato de Potássio",
      "tipo_registro": "composto",
      "componentes": [
        "Amoxicilina (500mg)",
        "Ácido Clavulânico / Clavulanato (125mg)"
      ],
      "nomes_comerciais": [
        "Clavulin",
        "Novamox 2x"
      ],
      "apresentacao": "500mg + 125mg · Comprimido Revestido",
      "categoria": "Antibiótico Composto (Associação)",
      "validade_receita_dias": 10,
      "alerta_seguranca": "Medicamento Composto: Associação com Clavulanato de Potássio. Receita válida por 10 dias (RDC 471/2021 Anvisa).",
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs001",
          "zona": "Oeste",
          "nome": "UBS Dr. José Leão – Vila Madalena",
          "endereco": "Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP",
          "cep": "05417-011",
          "telefone": "(11) 3812-4400",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.5558,
            "lng": -46.6975
          },
          "estoque_percentual": 65,
          "obs": "Retirada com receita médica válida de controle especial (máx 10 dias)."
        },
        {
          "id": "ubs005",
          "zona": "Centro",
          "nome": "UBS Bela Vista – Centro",
          "endereco": "Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP",
          "cep": "01401-000",
          "telefone": "(11) 3107-2200",
          "horario": "Segunda a Sexta: 07h às 19h",
          "coordenadas": {
            "lat": -23.5618,
            "lng": -46.6549
          },
          "estoque_percentual": 70,
          "obs": "Retirada com receita médica de controle especial."
        }
      ]
    },
    {
      "id": "med014",
      "nome": "Lisador (Medicamento Composto)",
      "nome_generico": "Dipirona + Prometazina + Adifenina",
      "tipo_registro": "composto",
      "componentes": [
        "Dipirona Monoidratada (500mg)",
        "Cloridrato de Prometazina (5mg)",
        "Cloridrato de Adifenina (10mg)"
      ],
      "nomes_comerciais": [
        "Lisador"
      ],
      "apresentacao": "Comprimido / Gotas",
      "categoria": "Analgésico / Antiespasmódico Composto",
      "validade_receita_dias": 30,
      "alerta_seguranca": "Alerta de Alergia: Medicamento Composto com múltiplos princípios ativos (Dipirona, Prometazina e Adifenina). Não tomar se for alérgico a qualquer um dos componentes.",
      "disponivel": true,
      "ubs": [
        {
          "id": "ubs003",
          "zona": "Norte",
          "nome": "UBS Santana – Zona Norte",
          "endereco": "Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP",
          "cep": "02011-001",
          "telefone": "(11) 2973-5600",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5014,
            "lng": -46.6226
          },
          "estoque_percentual": 80,
          "obs": "Atenção alérgica a dipirona ou anti-histamínicos."
        },
        {
          "id": "ubs007",
          "zona": "Leste",
          "nome": "UBS Itaquera – Zona Leste",
          "endereco": "Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP",
          "cep": "08230-010",
          "telefone": "(11) 2074-5300",
          "horario": "Segunda a Sexta: 07h às 17h",
          "coordenadas": {
            "lat": -23.5342,
            "lng": -46.4475
          },
          "estoque_percentual": 60,
          "obs": "Retirada orientada por farmacêutico."
        }
      ]
    }
  ]
};

// ═════════════════════════════════════════════════════════════════════════════
// 2. MÓDULO DE ACESSIBILIDADE (WCAG 2.1 AA)
// ═════════════════════════════════════════════════════════════════════════════
/**
 * BuscaSaúde · js/modulo-acessibilidade.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Módulo de Acessibilidade (IHC / WCAG 2.1 Nível AA):
 * - Ajuste de escala tipográfica (A-, A, A+)
 * - Modo Alto Contraste (design tokens :root)
 * - Anunciador sonoro e ARIA Live Region para leitores de tela
 * ─────────────────────────────────────────────────────────────────────────────
 */



const ModuloAcessibilidade = {
  FONT_SCALES: [0.85, 1, 1.15, 1.30],
  FONT_LABELS: ['Muito pequena', 'Normal', 'Grande', 'Muito grande'],

  estado: {
    fontScale: 1,
    highContrast: false
  },

  init() {
    this.carregarPreferencias();
    this.vincularEventos();
  },

  carregarPreferencias() {
    try {
      const savedScale = parseFloat(localStorage.getItem('bs_fontScale'));
      const savedContrast = localStorage.getItem('bs_highContrast') === 'true';
      if (this.FONT_SCALES.includes(savedScale)) this.aplicarFontScale(savedScale);
      if (savedContrast) this.toggleContraste();
    } catch (_) {}
  },

  vincularEventos() {
    document.getElementById('btn-font-increase')?.addEventListener('click', () => this.aumentarFonte());
    document.getElementById('btn-font-decrease')?.addEventListener('click', () => this.diminuirFonte());
    document.getElementById('btn-font-reset')?.addEventListener('click', () => this.resetarFonte());
    document.getElementById('btn-contrast')?.addEventListener('click', () => this.toggleContraste());
  },

  aplicarFontScale(scale) {
    this.estado.fontScale = scale;
    document.documentElement.style.setProperty('--font-scale', scale);
    try { localStorage.setItem('bs_fontScale', scale); } catch (_) {}
    const idx = this.FONT_SCALES.indexOf(scale);
    const label = this.FONT_LABELS[idx] || 'Ajustada';
    this.anunciarAria(`Tamanho da fonte ajustado para: ${label}`);
  },

  aumentarFonte() {
    const idx = this.FONT_SCALES.indexOf(this.estado.fontScale);
    if (idx < this.FONT_SCALES.length - 1) this.aplicarFontScale(this.FONT_SCALES[idx + 1]);
  },

  diminuirFonte() {
    const idx = this.FONT_SCALES.indexOf(this.estado.fontScale);
    if (idx > 0) this.aplicarFontScale(this.FONT_SCALES[idx - 1]);
  },

  resetarFonte() {
    this.aplicarFontScale(1);
  },

  toggleContraste() {
    this.estado.highContrast = !this.estado.highContrast;
    document.body.classList.toggle('high-contrast', this.estado.highContrast);
    const btnContrast = document.getElementById('btn-contrast');
    if (btnContrast) {
      btnContrast.setAttribute('aria-pressed', String(this.estado.highContrast));
      btnContrast.classList.toggle('active', this.estado.highContrast);
    }
    try { localStorage.setItem('bs_highContrast', String(this.estado.highContrast)); } catch (_) {}
    this.anunciarAria(this.estado.highContrast ? 'Modo alto contraste ativado.' : 'Modo alto contraste desativado.');
  },

  anunciarAria(msg) {
    let el = document.getElementById('aria-announcer');
    if (!el) {
      el = document.createElement('div');
      el.id = 'aria-announcer';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
      document.body.appendChild(el);
    }
    el.textContent = '';
    setTimeout(() => { el.textContent = msg; }, 50);
  }
};


// ═════════════════════════════════════════════════════════════════════════════
// 3. MÓDULO DA MASCOTE DRA. NINA
// ═════════════════════════════════════════════════════════════════════════════
/**
 * BuscaSaúde · js/modulo-mascote.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Módulo da Mascote Dra. Nina:
 * - Ciclo de piscar espontâneo via troca de sprites ('nina_piscando.png' -> 'nina_neutra.png')
 * - Animação de fala com sprites dinâmicos ('nina_falando.png', 'nina_gesticulando.png')
 * - Síntese de voz em pt-BR (Web Speech API) com voz feminina natural
 * - Rotação e navegação das Dicas do Dia (ODS 3)
 * ─────────────────────────────────────────────────────────────────────────────
 */



const ModuloMascote = {
  SPRITES: {
    neutra:       'assets/images/nina_neutra.png',
    falando:      'assets/images/nina_falando.png',
    gesticulando: 'assets/images/nina_gesticulando.png',
    piscando:     'assets/images/nina_piscando.png'
  },

  MSGS: {
    inicial:       'Olá! Sou a Dra. Nina. Que medicamento procura hoje? Escreva abaixo e eu ajudo a encontrar a UBS mais próxima.',
    buscando:      (m) => `Consultando estoque de "${m}" nas UBSs de São Paulo…`,
    encontrado:    (m, n) => `Ótima notícia! Encontrei ${m} disponível em ${n} UBS próxima${n > 1 ? 's' : ''}! 🎉`,
    semZona:       (m, z) => `${m} está disponível, mas não na Zona ${z}. Tente ver em outras zonas!`,
    naoEncontrado: 'Puxa, este medicamento não foi encontrado ou está em falta no momento. Por favor, consulte sua UBS ou médico. 😿',
    campoVazio:    'Por favor, escreva o nome de um medicamento ou princípio ativo para eu pesquisar!'
  },

  DICAS_DO_DIA: [
    '💧 Beba pelo menos 2 litros de água por dia. A hidratação adequada regula a pressão arterial e apoia a função renal.',
    '💉 Mantenha sua carteira de vacinação atualizada! As vacinas protegem contra doenças graves e são gratuitas no SUS.',
    '🩺 Meça sua pressão arterial regularmente. A hipertensão é silenciosa — detectá-la cedo salva vidas (ODS 3).',
    '🚶‍♂️ 30 minutos de caminhada diária reduzem em até 35% o risco de doenças cardiovasculares.',
    '🍎 Reduza o consumo de sal e alimentos ultraprocessados. Priorize frutas, legumes e grãos integrais.',
    '😴 Durma de 7 a 8 horas por noite. O sono de qualidade revigora a imunidade e o equilíbrio metabólico.',
    '💊 Antibióticos devem ser tomados rigorosamente nos horários e prazo prescrito para evitar resistência bacteriana.'
  ],

  estado: {
    falando: false,
    intervaloFala: null,
    timeoutPiscar: null,
    tipIndex: 0,
    tipTimer: null,
    speechSupported: 'speechSynthesis' in window
  },

  init() {
    this.preCarregarSprites();
    this.trocarSprite('neutra');
    this.iniciarCicloPiscar();
    this.iniciarDicas();
    this.vincularEventos();
    this.atualizarBalao(this.MSGS.inicial);

    if (this.estado.speechSupported) {
      window.speechSynthesis.onvoiceschanged = () => this.obterVozFeminina();
    }
  },

  preCarregarSprites() {
    Object.values(this.SPRITES).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  },

  vincularEventos() {
    document.getElementById('btn-narrar-nina')?.addEventListener('click', () => {
      const txt = document.getElementById('dra-nina-balao')?.querySelector('.balloon-text')?.textContent;
      if (this.estado.falando) this.pararFala();
      else this.falar(txt || this.MSGS.inicial);
    });

    document.getElementById('btn-parar-toast')?.addEventListener('click', () => this.pararFala());

    document.getElementById('btn-tip-next')?.addEventListener('click', () => this.trocarDica(this.estado.tipIndex + 1));
    document.getElementById('btn-tip-prev')?.addEventListener('click', () => this.trocarDica(this.estado.tipIndex - 1));

    const tipCard = document.querySelector('.tip-card');
    tipCard?.addEventListener('mouseenter', () => clearInterval(this.estado.tipTimer));
    tipCard?.addEventListener('mouseleave', () => {
      this.estado.tipTimer = setInterval(() => this.trocarDica(this.estado.tipIndex + 1), 12000);
    });
  },

  trocarSprite(tipo) {
    const imgEl = document.getElementById('dra-nina-img');
    if (!imgEl || !this.SPRITES[tipo]) return;
    imgEl.src = this.SPRITES[tipo];
  },

  piscar() {
    if (this.estado.falando) return;
    this.trocarSprite('piscando');
    setTimeout(() => {
      if (!this.estado.falando) this.trocarSprite('neutra');
    }, 180);
  },

  iniciarCicloPiscar() {
    clearTimeout(this.estado.timeoutPiscar);
    const intervalo = 2800 + Math.random() * 2800;
    this.estado.timeoutPiscar = setTimeout(() => {
      this.piscar();
      if (Math.random() < 0.25) {
        setTimeout(() => this.piscar(), 360);
      }
      this.iniciarCicloPiscar();
    }, intervalo);
  },

  obterVozFeminina() {
    if (!this.estado.speechSupported) return null;
    const vozes = window.speechSynthesis.getVoices();
    if (!vozes || !vozes.length) return null;

    const vozesPt = vozes.filter(v => v.lang === 'pt-BR' || v.lang.startsWith('pt'));
    if (!vozesPt.length) return null;

    const nomesFemininos = [
      /francisca/i, /maria/i, /thalita/i, /leticia|letícia/i,
      /heloisa|heloísa/i, /luciana/i, /yara/i, /fernanda/i,
      /camila/i, /vitoria|vitória/i, /female/i, /mulher/i,
      /google português do brasil/i
    ];

    for (const regex of nomesFemininos) {
      const encontrada = vozesPt.find(v => regex.test(v.name));
      if (encontrada) return encontrada;
    }

    const semMasculino = vozesPt.filter(v => !/daniel|antonio|antônio|felipe|ricardo|male|homem/i.test(v.name));
    return semMasculino.length ? semMasculino[0] : vozesPt[0];
  },

  falar(texto) {
    if (!texto || !texto.trim()) return;
    this.pararFala();

    this.estado.falando = true;
    const imgEl = document.getElementById('dra-nina-img');
    imgEl?.classList.add('dra-nina-falando');

    const ciclo = ['falando', 'gesticulando', 'falando', 'neutra'];
    let frame = 0;
    this.estado.intervaloFala = setInterval(() => {
      frame = (frame + 1) % ciclo.length;
      this.trocarSprite(ciclo[frame]);
    }, 280);

    this.exibirToast('A Dra. Nina está falando… clique para parar.');

    if (this.estado.speechSupported) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.95;
        utterance.pitch = 1.15;

        const voz = this.obterVozFeminina();
        if (voz) utterance.voice = voz;

        utterance.onend = () => this.pararFala();
        utterance.onerror = () => this.pararFala();

        window.speechSynthesis.speak(utterance);
      } catch (_) {
        this.simularFala(texto);
      }
    } else {
      this.simularFala(texto);
    }
  },

  simularFala(texto) {
    const duracao = Math.max(2200, texto.length * 65);
    setTimeout(() => {
      if (this.estado.falando) this.pararFala();
    }, duracao);
  },

  pararFala() {
    this.estado.falando = false;
    clearInterval(this.estado.intervaloFala);
    this.estado.intervaloFala = null;

    if (this.estado.speechSupported) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    const imgEl = document.getElementById('dra-nina-img');
    imgEl?.classList.remove('dra-nina-falando');
    this.trocarSprite('neutra');
    this.exibirToast(null);

    const btnVoz = document.getElementById('btn-voz');
    if (btnVoz) {
      btnVoz.classList.remove('speaking');
      const sp = btnVoz.querySelector('span');
      if (sp) sp.textContent = 'Ouvir';
    }
  },

  atualizarBalao(msg, estado = 'default') {
    const balao = document.getElementById('dra-nina-balao');
    const textoEl = balao?.querySelector('.balloon-text');
    if (!balao || !textoEl) return;

    balao.classList.remove('state-success', 'state-error', 'typing');
    if (estado === 'success') balao.classList.add('state-success');
    if (estado === 'error')   balao.classList.add('state-error');
    if (estado === 'typing')  balao.classList.add('typing');

    textoEl.style.opacity = '0';
    setTimeout(() => {
      textoEl.textContent = msg;
      textoEl.style.opacity = '1';
    }, 120);
  },

  reagirResultado(tipo) {
    const imgEl = document.getElementById('dra-nina-img');
    if (!imgEl) return;
    imgEl.classList.remove('dra-nina-happy', 'dra-nina-sad');

    if (tipo === 'sucesso') {
      imgEl.classList.add('dra-nina-happy');
      this.piscar();
      setTimeout(() => imgEl.classList.remove('dra-nina-happy'), 1600);
    } else if (tipo === 'falta') {
      imgEl.classList.add('dra-nina-sad');
      setTimeout(() => imgEl.classList.remove('dra-nina-sad'), 2000);
    }
  },

  iniciarDicas() {
    const diaDoAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    this.trocarDica(diaDoAno % this.DICAS_DO_DIA.length);
    this.estado.tipTimer = setInterval(() => this.trocarDica(this.estado.tipIndex + 1), 12000);
  },

  trocarDica(idx) {
    const tipTexto = document.getElementById('tip-texto');
    const tipCounter = document.getElementById('tip-counter');
    if (!tipTexto || !tipCounter) return;

    const total = this.DICAS_DO_DIA.length;
    this.estado.tipIndex = ((idx % total) + total) % total;

    tipTexto.style.opacity = '0';
    setTimeout(() => {
      tipTexto.textContent = this.DICAS_DO_DIA[this.estado.tipIndex];
      tipCounter.textContent = `${this.estado.tipIndex + 1}/${total}`;
      tipTexto.style.opacity = '1';
    }, 120);
  },

  exibirToast(msg) {
    const toast = document.getElementById('toast-voz');
    const msgEl = document.getElementById('toast-voz-msg');
    if (!toast) return;
    if (!msg) {
      toast.hidden = true;
      return;
    }
    if (msgEl) msgEl.textContent = msg;
    toast.hidden = false;
  }
};


// ═════════════════════════════════════════════════════════════════════════════
// 4. MÓDULO DE BUSCA INTELIGENTE E UBS
// ═════════════════════════════════════════════════════════════════════════════
/**
 * BuscaSaúde · js/modulo-busca.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Módulo de Busca Inteligente de Medicamentos:
 * - Prioridade absoluta para Princípio Ativo (SUS)
 * - Nomes Comerciais tratados como secundários (ex: "Dimefor" não interfere com "di")
 * - Alerta de composição para Medicamentos Compostos / Associações (segurança contra alergias)
 * - Identificação da validade legal da receita (10 dias p/ antibióticos RDC 471/2021)
 * - Autocomplete com navegação por teclado e histórico local
 * - Integração com comando de voz (SpeechRecognition)
 * ─────────────────────────────────────────────────────────────────────────────
 */



// ModuloMascote acessivel globalmente

const ModuloBusca = {
  dados: {
    metadata: {},
    medicamentos: []
  },

  estado: {
    medicamentoAtual: null,
    marcaPesquisada: null,
    resultadosFiltrados: [],
    todasUbs: [],
    sugestoesAtuais: [],
    activeSuggestionIndex: -1,
    gravandoVoz: false,
    recognition: null
  },

  async init() {
    await this.carregarDados();
    this.vincularElementos();
    this.vincularEventos();
  },

    async carregarDados() {
    try {
      const res = await fetch('dados/dados_saude.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      this.dados = await res.json();
    } catch (e) {
      console.warn('Usando dados de saude embutidos (suporte a file:// e offline):', e);
      this.dados = DADOS_SAUDE_EMBUTIDOS;
    }
  },

  vincularElementos() {
    this.el = {
      form: document.getElementById('form-pesquisa'),
      input: document.getElementById('input-medicamento'),
      selectZona: document.getElementById('select-zona'),
      dropdown: document.getElementById('autocomplete-dropdown'),
      loading: document.getElementById('loading-state'),
      resultadosSection: document.getElementById('resultados-section'),
      listaUbs: document.getElementById('lista-ubs'),
      notFound: document.getElementById('not-found-state'),
      filterEmpty: document.getElementById('filter-empty'),
      alertaComercial: document.getElementById('alerta-comercial-sus'),
      alertaComercialTexto: document.getElementById('alerta-comercial-texto'),
      resultsTitle: document.getElementById('results-title-text'),
      resultsSubtitle: document.getElementById('results-subtitle'),
      btnMic: document.getElementById('btn-mic'),
      voiceBadge: document.getElementById('voice-listening-badge'),
      btnNovaBusca: document.getElementById('btn-nova-busca'),
      btnLimparFiltro: document.getElementById('btn-limpar-filtro'),
      btnVozResultados: document.getElementById('btn-voz'),
      chips: document.querySelectorAll('.suggestion-chip')
    };
  },

  vincularEventos() {
    this.el.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.fecharAutocomplete();
      this.executarBusca(this.el.input?.value || '');
    });

    this.el.input?.addEventListener('input', () => {
      const termo = this.el.input.value;
      if (!termo.trim()) {
        this.renderizarPainelFoco();
        return;
      }
      const sugestoes = this.buscarSugestoes(termo);
      this.renderizarAutocomplete(sugestoes, termo);
    });

    this.el.input?.addEventListener('focus', () => {
      const termo = this.el.input.value;
      if (!termo.trim()) {
        this.renderizarPainelFoco();
      } else {
        const sugestoes = this.buscarSugestoes(termo);
        this.renderizarAutocomplete(sugestoes, termo);
      }
    });

    this.el.input?.addEventListener('keydown', (e) => this.tratarNavegacaoTeclado(e));

    document.addEventListener('click', (e) => {
      if (!this.el.form?.contains(e.target) && !this.el.dropdown?.contains(e.target)) {
        this.fecharAutocomplete();
      }
    });

    this.el.selectZona?.addEventListener('change', () => {
      if (this.estado.medicamentoAtual) this.aplicarFiltroZona();
    });

    this.el.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const med = chip.dataset.med;
        if (this.el.input) this.el.input.value = med;
        this.fecharAutocomplete();
        this.executarBusca(med);
      });
    });

    this.el.btnMic?.addEventListener('click', () => this.toggleComandoVoz());
    this.el.btnNovaBusca?.addEventListener('click', () => this.resetar());
    this.el.btnLimparFiltro?.addEventListener('click', () => {
      if (this.el.selectZona) this.el.selectZona.value = 'todas';
      this.aplicarFiltroZona();
    });

    this.el.btnVozResultados?.addEventListener('click', () => {
      const txt = this.gerarResumoVoz();
      ModuloMascote.falar(txt);
    });
  },

  normalizar(txt) {
    return (txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  escapeHtml(txt) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(txt || '')));
    return d.innerHTML;
  },

  destacarTermo(texto, termo) {
    if (!termo || !texto) return this.escapeHtml(texto);
    const textoLimpo = String(texto);
    const termoNorm = this.normalizar(termo.trim());
    const textoNorm = this.normalizar(textoLimpo);
    const idx = textoNorm.indexOf(termoNorm);
    if (idx === -1) return this.escapeHtml(textoLimpo);

    const antes = textoLimpo.substring(0, idx);
    const meio = textoLimpo.substring(idx, idx + termo.trim().length);
    const depois = textoLimpo.substring(idx + termo.trim().length);

    return `${this.escapeHtml(antes)}<mark class="highlight-match">${this.escapeHtml(meio)}</mark>${this.escapeHtml(depois)}`;
  },

  /**
   * Lógica de Autocomplete Rigorosa:
   * Prioridade 1: Princípio Ativo (SUS). Se o usuário digitar "di", dá match em Dipirona.
   * Prioridade 2: Marca Comercial só aparece se o termo tiver 3+ letras E a marca começar com o termo,
   * ou se o usuário digitar o nome exato da marca.
   */
  buscarSugestoes(termo) {
    if (!termo || !termo.trim()) return [];
    const tNorm = this.normalizar(termo.trim());
    const sugestoesPrincipais = [];
    const sugestoesMarcas = [];

    this.dados.medicamentos.forEach(med => {
      const nomeNorm = this.normalizar(med.nome);
      const genNorm = this.normalizar(med.nome_generico);

      // Match no princípio ativo
      let scoreAtivo = 0;
      if (nomeNorm === tNorm) scoreAtivo = 100;
      else if (nomeNorm.startsWith(tNorm)) scoreAtivo = 85;
      else if (nomeNorm.includes(tNorm)) scoreAtivo = 50;
      else if (genNorm.includes(tNorm)) scoreAtivo = 40;

      if (scoreAtivo > 0) {
        sugestoesPrincipais.push({
          tipo: 'principio_ativo',
          termoBusca: med.nome,
          nomeExibicao: med.nome,
          medicamento: med,
          score: scoreAtivo
        });
      }

      // Match em nomes comerciais (apenas com prefixo claro e mínimo de 3 caracteres)
      if (med.nomes_comerciais && Array.isArray(med.nomes_comerciais)) {
        med.nomes_comerciais.forEach(marca => {
          const mNorm = this.normalizar(marca);
          let scoreMarca = 0;
          if (mNorm === tNorm) {
            scoreMarca = 90;
          } else if (tNorm.length >= 3 && mNorm.startsWith(tNorm)) {
            scoreMarca = 70;
          } else if (tNorm.length >= 4 && mNorm.includes(tNorm)) {
            scoreMarca = 30;
          }

          if (scoreMarca > 0) {
            sugestoesMarcas.push({
              tipo: 'marca_comercial',
              termoBusca: marca,
              nomeExibicao: marca,
              marcaNome: marca,
              medicamento: med,
              score: scoreMarca
            });
          }
        });
      }
    });

    sugestoesPrincipais.sort((a, b) => b.score - a.score);
    sugestoesMarcas.sort((a, b) => b.score - a.score);

    // Princípios ativos vêm sempre primeiro
    const unificadas = [...sugestoesPrincipais, ...sugestoesMarcas];
    const vistas = new Set();
    const resultado = [];

    for (const item of unificadas) {
      const chave = `${item.tipo}-${item.termoBusca}-${item.medicamento.id}`;
      if (!vistas.has(chave)) {
        vistas.add(chave);
        resultado.push(item);
        if (resultado.length >= 6) break;
      }
    }

    return resultado;
  },

  renderizarAutocomplete(sugestoes, termo) {
    if (!this.el.dropdown) return;
    this.estado.sugestoesAtuais = sugestoes;
    this.estado.activeSuggestionIndex = -1;

    if (this.el.input) {
      this.el.input.setAttribute('aria-expanded', 'true');
      this.el.input.removeAttribute('aria-activedescendant');
    }

    if (sugestoes.length === 0) {
      this.el.dropdown.innerHTML = `
        <div class="autocomplete-empty">
          <span class="autocomplete-empty-icon" aria-hidden="true">🔍</span>
          <p class="autocomplete-empty-title">Nenhum medicamento encontrado para "${this.escapeHtml(termo)}"</p>
          <p class="autocomplete-empty-tip">Busque pelo princípio ativo (ex: Dipirona, Losartana) ou marca de referência.</p>
        </div>
      `;
      this.el.dropdown.hidden = false;
      return;
    }

    let html = `
      <div class="autocomplete-header">
        <span><i class="bi bi-stars me-1" aria-hidden="true"></i>Sugestões de Busca</span>
        <span class="d-none d-sm-inline text-muted" style="font-weight:600;font-size:11px;">↑↓ navegar · Enter selecionar</span>
      </div>
      <ul class="autocomplete-list" role="listbox">
    `;

    sugestoes.forEach((sug, idx) => {
      const med = sug.medicamento;
      const temEstoque = med.disponivel && med.ubs && med.ubs.length > 0;
      const badgeEstoque = temEstoque
        ? `<span class="badge-stock-sim"><i class="bi bi-check-circle-fill"></i> Disponível nas UBS</span>`
        : `<span class="badge-stock-nao"><i class="bi bi-x-circle-fill"></i> Em falta</span>`;

      if (sug.tipo === 'marca_comercial') {
        html += `
          <li id="sugestao-${idx}" class="autocomplete-item" role="option" aria-selected="false" data-index="${idx}" tabindex="0">
            <div class="autocomplete-item-content">
              <div class="autocomplete-item-top">
                <span class="autocomplete-item-name">${this.destacarTermo(sug.marcaNome, termo)}</span>
                <span class="badge-tag-comercial"><i class="bi bi-tag-fill me-1"></i>Nome Comercial</span>
              </div>
              <div class="autocomplete-item-sub">
                <strong>Princípio Ativo SUS:</strong> ${this.escapeHtml(med.nome)} · ${this.escapeHtml(med.apresentacao)}
              </div>
            </div>
            <div class="autocomplete-item-badge">
              ${badgeEstoque}
            </div>
          </li>
        `;
      } else {
        const marcaHint = med.nomes_comerciais?.length
          ? `<div class="autocomplete-item-brands"><i class="bi bi-tag me-1"></i>Exemplos comerciais: ${this.escapeHtml(med.nomes_comerciais.slice(0, 3).join(', '))}</div>`
          : '';

        const badgeTipo = med.tipo_registro === 'composto'
          ? `<span class="badge-tag-comercial" style="background:#FFF3E0;color:#E65100;border-color:#FFE0B2;"><i class="bi bi-exclamation-triangle-fill me-1"></i>Associação / Composto</span>`
          : `<span class="badge-tag-generico"><i class="bi bi-capsule me-1"></i>Princípio Ativo</span>`;

        html += `
          <li id="sugestao-${idx}" class="autocomplete-item" role="option" aria-selected="false" data-index="${idx}" tabindex="0">
            <div class="autocomplete-item-content">
              <div class="autocomplete-item-top">
                <span class="autocomplete-item-name">${this.destacarTermo(med.nome, termo)}</span>
                ${badgeTipo}
              </div>
              <div class="autocomplete-item-sub">
                ${this.escapeHtml(med.apresentacao)} · ${this.escapeHtml(med.categoria)}
              </div>
              ${marcaHint}
            </div>
            <div class="autocomplete-item-badge">
              ${badgeEstoque}
            </div>
          </li>
        `;
      }
    });

    html += `
      </ul>
      <div class="autocomplete-footer">
        <span><i class="bi bi-info-circle me-1" aria-hidden="true"></i>Pesquisa de Medicamentos · Dados Simulados</span>
        <span>Aperte Enter para buscar</span>
      </div>
    `;

    this.el.dropdown.innerHTML = html;
    this.el.dropdown.hidden = false;

    this.el.dropdown.querySelectorAll('.autocomplete-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        this.selecionarSugestao(idx);
      });
    });
  },

  selecionarSugestao(index) {
    const sug = this.estado.sugestoesAtuais[index];
    if (!sug) return;
    this.fecharAutocomplete();

    if (sug.tipo === 'marca_comercial') {
      this.estado.marcaPesquisada = sug.marcaNome;
      if (this.el.input) this.el.input.value = sug.marcaNome;
      this.executarBusca(sug.marcaNome);
    } else {
      this.estado.marcaPesquisada = null;
      if (this.el.input) this.el.input.value = sug.medicamento.nome;
      this.executarBusca(sug.medicamento.nome);
    }
  },

  fecharAutocomplete() {
    if (this.el.dropdown) {
      this.el.dropdown.hidden = true;
      this.el.dropdown.innerHTML = '';
    }
    if (this.el.input) {
      this.el.input.setAttribute('aria-expanded', 'false');
      this.el.input.removeAttribute('aria-activedescendant');
    }
    this.estado.sugestoesAtuais = [];
    this.estado.activeSuggestionIndex = -1;
  },

  tratarNavegacaoTeclado(e) {
    if (!this.el.dropdown || this.el.dropdown.hidden || !this.estado.sugestoesAtuais.length) {
      if (e.key === 'ArrowDown' && this.el.input?.value.trim() === '') {
        this.renderizarPainelFoco();
        e.preventDefault();
      }
      return;
    }

    const total = this.estado.sugestoesAtuais.length;
    const items = this.el.dropdown.querySelectorAll('.autocomplete-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.estado.activeSuggestionIndex = (this.estado.activeSuggestionIndex + 1) % total;
      this.atualizarItemAtivo(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.estado.activeSuggestionIndex = (this.estado.activeSuggestionIndex - 1 + total) % total;
      this.atualizarItemAtivo(items);
    } else if (e.key === 'Enter') {
      if (this.estado.activeSuggestionIndex >= 0 && this.estado.activeSuggestionIndex < total) {
        e.preventDefault();
        this.selecionarSugestao(this.estado.activeSuggestionIndex);
      }
    } else if (e.key === 'Escape') {
      this.fecharAutocomplete();
    }
  },

  atualizarItemAtivo(items) {
    items.forEach((item, idx) => {
      const active = idx === this.estado.activeSuggestionIndex;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      if (active) {
        item.scrollIntoView({ block: 'nearest' });
        this.el.input?.setAttribute('aria-activedescendant', `sugestao-${idx}`);
      }
    });
  },

  renderizarPainelFoco() {
    if (!this.el.dropdown) return;
    const historico = this.obterHistorico();

    let html = '';
    if (historico.length > 0) {
      html = `
        <div class="autocomplete-header">
          <span><i class="bi bi-clock-history me-1" aria-hidden="true"></i>Pesquisas Recentes</span>
          <button type="button" class="btn-limpar-historico-autocomplete" id="btn-limpar-hist">Limpar</button>
        </div>
        <ul class="autocomplete-list" role="listbox">
      `;
      historico.forEach(item => {
        html += `
          <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="${this.escapeHtml(item)}" tabindex="0">
            <div class="autocomplete-item-content">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-clock text-muted" aria-hidden="true"></i>
                <strong class="autocomplete-item-name" style="font-size:var(--fs-sm);">${this.escapeHtml(item)}</strong>
              </div>
            </div>
            <i class="bi bi-arrow-up-left text-muted" aria-hidden="true"></i>
          </li>
        `;
      });
      html += `</ul>`;
    } else {
      html = `
        <div class="autocomplete-header">
          <span><i class="bi bi-lightning-charge-fill me-1" aria-hidden="true"></i>Exemplos de Medicamentos</span>
        </div>
        <ul class="autocomplete-list" role="listbox">
          <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Dipirona" tabindex="0">
            <div class="autocomplete-item-content">
              <strong>Dipirona</strong> <span class="text-muted">(Princípio Ativo SUS)</span>
            </div>
          </li>
          <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Amoxicilina" tabindex="0">
            <div class="autocomplete-item-content">
              <strong>Amoxicilina</strong> <span class="text-muted">(Antibiótico - Receita 10 dias)</span>
            </div>
          </li>
          <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Lisador" tabindex="0">
            <div class="autocomplete-item-content">
              <strong>Lisador</strong> <span class="badge-tag-comercial" style="font-size:10px;">Associação Composta</span>
            </div>
          </li>
        </ul>
      `;
    }

    html += `
      <div class="autocomplete-footer">
        <span>Pesquisa de Medicamentos · Dados Simulados</span>
        <span>BuscaSaúde</span>
      </div>
    `;

    this.el.dropdown.innerHTML = html;
    this.el.dropdown.hidden = false;
    this.el.input?.setAttribute('aria-expanded', 'true');

    this.el.dropdown.querySelector('#btn-limpar-hist')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.limparHistorico();
    });

    this.el.dropdown.querySelectorAll('.autocomplete-recent-item').forEach(el => {
      el.addEventListener('click', () => {
        const t = el.dataset.termo;
        if (this.el.input) this.el.input.value = t;
        this.fecharAutocomplete();
        this.executarBusca(t);
      });
    });
  },

  salvarHistorico(termo) {
    if (!termo || !termo.trim()) return;
    const t = termo.trim();
    let hist = this.obterHistorico().filter(i => this.normalizar(i) !== this.normalizar(t));
    hist.unshift(t);
    if (hist.length > 5) hist = hist.slice(0, 5);
    try { localStorage.setItem('bs_recent_searches', JSON.stringify(hist)); } catch (_) {}
  },

  obterHistorico() {
    try {
      const raw = localStorage.getItem('bs_recent_searches');
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  },

  limparHistorico() {
    try { localStorage.removeItem('bs_recent_searches'); } catch (_) {}
    this.fecharAutocomplete();
  },

  async executarBusca(termo) {
    if (!termo || !termo.trim()) {
      ModuloMascote.atualizarBalao(ModuloMascote.MSGS.campoVazio, 'error');
      this.el.input?.focus();
      return;
    }

    const termoLimpo = termo.trim();
    const tNorm = this.normalizar(termoLimpo);
    this.salvarHistorico(termoLimpo);

    this.fecharAutocomplete();
    ModuloMascote.pararFala();
    this.mostrarLoading(true);
    this.ocultarResultados();
    if (this.el.alertaComercial) this.el.alertaComercial.hidden = true;

    ModuloMascote.atualizarBalao(ModuloMascote.MSGS.buscando(termoLimpo), 'typing');

    // Simulação suave de latência
    await new Promise(r => setTimeout(r, 400));

    let encontrado = null;
    let marcaEncontrada = null;

    // 1. Prioridade Absoluta: Princípio Ativo (Nome ou Genérico)
    encontrado = this.dados.medicamentos.find(m => {
      const n = this.normalizar(m.nome);
      const g = this.normalizar(m.nome_generico);
      return n === tNorm || n.startsWith(tNorm) || tNorm.startsWith(n) || g.includes(tNorm);
    });

    // 2. Se não encontrou por princípio ativo, tenta match em nome comercial
    if (!encontrado) {
      for (const m of this.dados.medicamentos) {
        if (m.nomes_comerciais && Array.isArray(m.nomes_comerciais)) {
          const mc = m.nomes_comerciais.find(marca => {
            const mcn = this.normalizar(marca);
            return mcn === tNorm || (tNorm.length >= 3 && mcn.startsWith(tNorm));
          });
          if (mc) {
            marcaEncontrada = mc;
            encontrado = m;
            break;
          }
        }
      }
    }

    // 3. Fallback: Categoria terapêutica
    if (!encontrado) {
      encontrado = this.dados.medicamentos.find(m => this.normalizar(m.categoria).includes(tNorm));
    }

    this.mostrarLoading(false);

    if (!encontrado || !encontrado.disponivel || !encontrado.ubs?.length) {
      ModuloMascote.atualizarBalao(ModuloMascote.MSGS.naoEncontrado, 'error');
      ModuloMascote.reagirResultado('falta');
      ModuloMascote.falar(ModuloMascote.MSGS.naoEncontrado);
      this.estado.medicamentoAtual = null;
      this.estado.todasUbs = [];
      this.estado.resultadosFiltrados = [];
      this.mostrarNaoEncontrado();
      return;
    }

    this.estado.medicamentoAtual = encontrado;
    this.estado.todasUbs = encontrado.ubs;
    this.estado.marcaPesquisada = marcaEncontrada;

    this.aplicarFiltroZona();
  },

  aplicarFiltroZona() {
    const med = this.estado.medicamentoAtual;
    if (!med) return;

    const zona = this.el.selectZona?.value || 'todas';
    const filtradas = zona === 'todas'
      ? this.estado.todasUbs
      : this.estado.todasUbs.filter(u => u.zona === zona);

    this.estado.resultadosFiltrados = filtradas;

    if (filtradas.length === 0) {
      const msg = ModuloMascote.MSGS.semZona(med.nome, zona);
      ModuloMascote.atualizarBalao(msg, 'error');
      ModuloMascote.reagirResultado('falta');
      ModuloMascote.falar(msg);
      this.mostrarFiltroVazio();
      return;
    }

    // Sucesso
    ModuloMascote.reagirResultado('sucesso');
    let msgFala = '';

    if (this.estado.marcaPesquisada) {
      const marca = this.estado.marcaPesquisada;
      const msgSucesso = `Você buscou pela marca ${marca}. No SUS, esse medicamento é dispensado pelo princípio ativo ${med.nome} (${med.apresentacao}). Encontrei disponível em ${filtradas.length} UBS próxima${filtradas.length > 1 ? 's' : ''}! 🎉`;
      ModuloMascote.atualizarBalao(msgSucesso, 'success');
      msgFala = `Você pesquisou pela marca ${marca}. No SUS, o fornecimento é feito pelo princípio ativo ${med.nome}. Encontrei disponível em ${filtradas.length} unidades de saúde.`;
    } else {
      const msgSucesso = ModuloMascote.MSGS.encontrado(med.nome, filtradas.length);
      ModuloMascote.atualizarBalao(msgSucesso, 'success');
      msgFala = msgSucesso;
    }

    ModuloMascote.falar(msgFala);

    // Alerta de Marca ou Medicamento Composto
    if (this.el.alertaComercial && this.el.alertaComercialTexto) {
      let alertaHtml = '';

      if (med.tipo_registro === 'composto') {
        alertaHtml += `
          <div class="mb-1 text-danger fw-bold">
            <i class="bi bi-shield-exclamation me-1"></i>ALERTA DE SEGURANÇA E ALERGIA (MEDICAMENTO COMPOSTO)
          </div>
          <div>${this.escapeHtml(med.alerta_seguranca)}</div>
          <div class="mt-1 small text-dark"><strong>Componentes da associação:</strong> ${this.escapeHtml(med.componentes.join(' + '))}</div>
        `;
      } else if (this.estado.marcaPesquisada) {
        alertaHtml += `
          <div><strong>Equivalência SUS:</strong> Você pesquisou pela marca <strong>${this.escapeHtml(this.estado.marcaPesquisada)}</strong>.
          Nas farmácias das UBS, o medicamento é fornecido pelo princípio ativo oficial <strong>${this.escapeHtml(med.nome)} (${this.escapeHtml(med.nome_generico)} - ${this.escapeHtml(med.apresentacao)})</strong> com idêntica bioequivalência aprovada pela Anvisa.</div>
        `;
      } else if (med.nomes_comerciais?.length) {
        alertaHtml += `
          <div><strong>Orientação Farmacêutica:</strong> <strong>${this.escapeHtml(med.nome)}</strong> é o princípio ativo oficial fornecido pelo SUS.
          Exemplos comerciais de referência: <em>${this.escapeHtml(med.nomes_comerciais.join(', '))}</em>.</div>
        `;
      }

      if (med.validade_receita_dias) {
        alertaHtml += `
          <div class="mt-2 pt-2 border-top small ${med.validade_receita_dias === 10 ? 'text-danger fw-bold' : 'text-muted'}">
            <i class="bi bi-file-earmark-medical me-1"></i>Validade legal da receita médica: <strong>${med.validade_receita_dias} dias</strong>
            ${med.validade_receita_dias === 10 ? ' (Antibiótico sujeito a controle especial - RDC 471/2021 da Anvisa)' : ''}.
          </div>
        `;
      }

      this.el.alertaComercialTexto.innerHTML = alertaHtml;
      this.el.alertaComercial.hidden = false;
    }

    // Renderizar Cards das UBS
    if (this.el.listaUbs) {
      this.el.listaUbs.innerHTML = '';
      filtradas.forEach(ubs => {
        this.el.listaUbs.appendChild(this.criarCardUbs(ubs, med.nome, med.apresentacao));
      });
    }

    // Cabeçalho de resultados
    if (this.el.resultsTitle) {
      if (this.estado.marcaPesquisada) {
        this.el.resultsTitle.innerHTML = `${this.escapeHtml(med.nome)} · ${this.escapeHtml(med.apresentacao)} <span class="badge-tag-comercial ms-2">Ref: ${this.escapeHtml(this.estado.marcaPesquisada)}</span>`;
      } else {
        this.el.resultsTitle.textContent = `${med.nome} · ${med.apresentacao}`;
      }
    }

    if (this.el.resultsSubtitle) {
      const zonaLabel = zona === 'todas' ? 'Todas as Zonas' : `Zona ${zona}`;
      this.el.resultsSubtitle.textContent = `${filtradas.length} UBS · ${med.categoria} · ${zonaLabel}`;
    }

    if (this.el.resultadosSection) this.el.resultadosSection.hidden = false;
    if (this.el.notFound) this.el.notFound.hidden = true;
    if (this.el.filterEmpty) this.el.filterEmpty.hidden = true;

    setTimeout(() => this.el.resultadosSection?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  },

  criarCardUbs(ubs, nomeMed, apresentacao) {
    const card = document.createElement('article');
    const classeStatus = ubs.estoque_percentual >= 70 ? 'status-alto' : (ubs.estoque_percentual >= 40 ? 'status-medio' : 'status-baixo');
    card.className = `ubs-card ${classeStatus}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `UBS: ${ubs.nome} — estoque ${ubs.estoque_percentual}%`);

    const cor = ubs.estoque_percentual >= 70
      ? 'linear-gradient(90deg,#43A047,#2E7D32)'
      : (ubs.estoque_percentual >= 40 ? 'linear-gradient(90deg,#FF8F00,#E65100)' : 'linear-gradient(90deg,#E53935,#C62828)');

    const linhasHor = (ubs.horario || '').split('\n').map(l => `<span class="d-block">${this.escapeHtml(l)}</span>`).join('');

    card.innerHTML = `
      <div class="ubs-card-header">
        <div class="ubs-card-icon" aria-hidden="true"><i class="bi bi-hospital-fill"></i></div>
        <div class="ubs-card-name">${this.escapeHtml(ubs.nome)}</div>
        <div class="ubs-card-badges">
          <span class="badge-disponivel"><i class="bi bi-check-circle-fill"></i> Disponível</span>
          <span class="badge-zona"><i class="bi bi-geo-alt"></i> Zona ${this.escapeHtml(ubs.zona)}</span>
        </div>
      </div>
      <div class="ubs-card-info">
        <div class="ubs-info-row">
          <i class="bi bi-capsule-pill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Medicamento</div>
          <div class="ubs-info-value">${this.escapeHtml(nomeMed)} · ${this.escapeHtml(apresentacao)}</div></div>
        </div>
        <div class="ubs-info-row">
          <i class="bi bi-geo-alt-fill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Endereço</div>
          <div class="ubs-info-value">${this.escapeHtml(ubs.endereco)}</div></div>
        </div>
        <div class="ubs-info-row">
          <i class="bi bi-clock-fill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Horário de Funcionamento</div>
          <div class="ubs-info-value">${linhasHor}</div></div>
        </div>
        ${ubs.telefone ? `
        <div class="ubs-info-row">
          <i class="bi bi-telephone-fill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Telefone</div>
          <div class="ubs-info-value">${this.escapeHtml(ubs.telefone)}</div></div>
        </div>` : ''}
        ${ubs.obs ? `
        <div class="ubs-info-row">
          <i class="bi bi-info-circle-fill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Orientação</div>
          <div class="ubs-info-value">${this.escapeHtml(ubs.obs)}</div></div>
        </div>` : ''}
      </div>
      <div class="ubs-stock-bar" aria-label="Estoque: ${ubs.estoque_percentual}%">
        <div class="stock-label">Nível de Estoque — ${ubs.estoque_percentual}%</div>
        <div class="stock-bar-track" role="progressbar" aria-valuenow="${ubs.estoque_percentual}" aria-valuemin="0" aria-valuemax="100">
          <div class="stock-bar-fill" style="width:${ubs.estoque_percentual}%;background:${cor};"></div>
        </div>
      </div>
      <div class="ubs-card-actions">
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubs.endereco)}" target="_blank" rel="noopener noreferrer" class="btn-mapa" aria-label="Ver rota no Google Maps">
          <i class="bi bi-map-fill me-2" aria-hidden="true"></i>Ver no Mapa
        </a>
        ${ubs.telefone ? `
        <a href="tel:+55${ubs.telefone.replace(/\D/g, '')}" class="btn-ligar" aria-label="Ligar para a UBS">
          <i class="bi bi-telephone-fill me-2" aria-hidden="true"></i>Ligar
        </a>` : ''}
      </div>
    `;

    return card;
  },

  gerarResumoVoz() {
    const med = this.estado.medicamentoAtual;
    const lista = this.estado.resultadosFiltrados;
    if (!med || !lista.length) return 'Nenhum resultado para ler.';

    let txt = `${med.nome} está disponível em ${lista.length} Unidade${lista.length > 1 ? 's' : ''} Básica${lista.length > 1 ? 's' : ''} de Saúde. `;
    lista.forEach((u, i) => {
      txt += `Opção ${i + 1}: ${u.nome}, na ${u.endereco}. `;
    });
    return txt;
  },

  toggleComandoVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      ModuloMascote.atualizarBalao('Pesquisa por voz indisponível neste navegador. Tente no Google Chrome.', 'error');
      ModuloMascote.falar('Pesquisa por voz indisponível neste navegador. Tente no Google Chrome.');
      return;
    }

    if (this.estado.gravandoVoz) {
      this.pararComandoVoz();
      return;
    }

    ModuloMascote.pararFala();

    try {
      this.estado.recognition = new SpeechRecognition();
      this.estado.recognition.lang = 'pt-BR';
      this.estado.recognition.continuous = false;

      this.estado.recognition.onstart = () => {
        this.estado.gravandoVoz = true;
        this.el.btnMic?.classList.add('listening');
        if (this.el.voiceBadge) this.el.voiceBadge.hidden = false;
        ModuloMascote.atualizarBalao('Estou ouvindo! Fale o nome do remédio...', 'typing');
      };

      this.estado.recognition.onresult = (ev) => {
        const transcript = ev.results[0][0].transcript;
        let termo = transcript
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
          .replace(/^(pesquisar|buscar|encontrar|ver|tem|remédio)\s+/i, '')
          .trim();

        if (this.el.input) this.el.input.value = termo || transcript.trim();
        this.pararComandoVoz();
        this.executarBusca(this.el.input.value);
      };

      this.estado.recognition.onerror = () => this.pararComandoVoz();
      this.estado.recognition.onend = () => this.pararComandoVoz();

      this.estado.recognition.start();
    } catch (_) {
      this.pararComandoVoz();
    }
  },

  pararComandoVoz() {
    this.estado.gravandoVoz = false;
    try { this.estado.recognition?.stop(); } catch (_) {}
    this.estado.recognition = null;
    this.el.btnMic?.classList.remove('listening');
    if (this.el.voiceBadge) this.el.voiceBadge.hidden = true;
  },

  mostrarLoading(show) {
    if (this.el.loading) this.el.loading.hidden = !show;
  },

  ocultarResultados() {
    if (this.el.resultadosSection) this.el.resultadosSection.hidden = true;
    if (this.el.listaUbs) this.el.listaUbs.innerHTML = '';
    if (this.el.notFound) this.el.notFound.hidden = true;
    if (this.el.filterEmpty) this.el.filterEmpty.hidden = true;
  },

  mostrarNaoEncontrado() {
    if (this.el.resultadosSection) this.el.resultadosSection.hidden = false;
    if (this.el.listaUbs) this.el.listaUbs.innerHTML = '';
    if (this.el.notFound) this.el.notFound.hidden = false;
    if (this.el.filterEmpty) this.el.filterEmpty.hidden = true;
  },

  mostrarFiltroVazio() {
    if (this.el.resultadosSection) this.el.resultadosSection.hidden = false;
    if (this.el.listaUbs) this.el.listaUbs.innerHTML = '';
    if (this.el.notFound) this.el.notFound.hidden = true;
    if (this.el.filterEmpty) this.el.filterEmpty.hidden = false;
  },

  resetar() {
    ModuloMascote.pararFala();
    this.fecharAutocomplete();
    this.ocultarResultados();
    if (this.el.alertaComercial) this.el.alertaComercial.hidden = true;
    ModuloMascote.atualizarBalao(ModuloMascote.MSGS.inicial, 'default');
    if (this.el.input) this.el.input.value = '';
    if (this.el.selectZona) this.el.selectZona.value = 'todas';
    this.estado.medicamentoAtual = null;
    this.estado.marcaPesquisada = null;
    this.estado.todasUbs = [];
    this.estado.resultadosFiltrados = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => this.el.input?.focus(), 400);
  }
};


// ═════════════════════════════════════════════════════════════════════════════
// 5. INICIALIZAÇÃO DA APLICAÇÃO
// ═════════════════════════════════════════════════════════════════════════════
async function bootstrap() {
  try {
    ModuloAcessibilidade.init();
  } catch (err) {
    console.error('Erro ao inicializar ModuloAcessibilidade:', err);
  }

  try {
    ModuloMascote.init();
  } catch (err) {
    console.error('Erro ao inicializar ModuloMascote:', err);
  }

  try {
    await ModuloBusca.init();
  } catch (err) {
    console.error('Erro ao inicializar ModuloBusca:', err);
  }

  // Foco inicial suave no campo de busca em computadores e tablets
  if (!window.matchMedia('(max-width: 768px)').matches) {
    document.getElementById('input-medicamento')?.focus();
  }

  // Tecla global Escape para fechar menus e parar narração/reconhecimento
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ModuloMascote.pararFala();
      ModuloBusca.pararComandoVoz();
      ModuloBusca.fecharAutocomplete();
    }
  });

  // Limpeza de áudio ao sair da página
  window.addEventListener('beforeunload', () => {
    ModuloMascote.pararFala();
    ModuloBusca.pararComandoVoz();
  });

  console.info(
    '%c BuscaSaúde FMU TECH 🏥 ',
    'background:#1565C0;color:#fff;font-size:14px;padding:4px 10px;border-radius:6px;font-weight:bold;',
    '\nODS 3 · 100% Funcional e compatível com abertura local (file://) e Servidores HTTP!'
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
