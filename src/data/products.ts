import { Product } from '../types/catalog';

export const productsData: Product[] = [
  // PISOS E PORCELANATOS
  {
    id: 'porcelanato-polido-60x60',
    codigo: 'PIS-101',
    nome: 'Porcelanato Polido 60x60cm',
    categoria: 'pisos',
    categoriaNome: 'Pisos e porcelanatos',
    descricao: 'Porcelanato retificado com acabamento polido de alto brilho, bordas retas que possibilitam junta mínima de 1,5mm. Ideal para salas, quartos e corredores residenciais.',
    unidade: 'm²',
    permiteDecimal: true,
    quantidadeMinima: 1,
    incremento: 0.5,
    imagem: '/assets/produtos/porcelanato.jpg',
    alt: 'Pilha de placas de porcelanato polido 60x60cm tom neutro',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'bege-crema', nome: 'Bege Crema', detalhe: 'Superfície uniforme polida' },
      { id: 'cinza-urbano', nome: 'Cinza Urbano', detalhe: 'Aspecto cimentício moderno' },
      { id: 'branco-classico', nome: 'Branco Clássico', detalhe: 'Brilho espelhado cristal' }
    ],
    especificacoes: [
      { chave: 'Formato', valor: '60 x 60 cm' },
      { chave: 'Acabamento', valor: 'Polido Retificado' },
      { chave: 'Junta mínima recomendada', valor: '1,5 mm' },
      { chave: 'Indicação de uso', valor: 'Piso interno residencial' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'piso-ceramico-antiderrapante',
    codigo: 'PIS-102',
    nome: 'Piso Cerâmico Rústico Antiderrapante 45x45cm',
    categoria: 'pisos',
    categoriaNome: 'Pisos e porcelanatos',
    descricao: 'Piso cerâmico com textura aderente e alta resistência a intempéries. Perfeito para calçadas, garagens, varandas e quintais.',
    unidade: 'm²',
    permiteDecimal: true,
    quantidadeMinima: 1,
    incremento: 0.5,
    imagem: '/assets/produtos/piso-ceramico.jpg',
    alt: 'Piso cerâmico rústico antiderrapante para áreas externas',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'areia-rustico', nome: 'Areia Rústico', detalhe: 'Tom terroso acetinado' },
      { id: 'grafite-externo', nome: 'Grafite Mineral', detalhe: 'Tom escuro resistente' }
    ],
    especificacoes: [
      { chave: 'Formato', valor: '45 x 45 cm' },
      { chave: 'PEI', valor: 'Alta resistência (PEI 4)' },
      { chave: 'Local de uso', valor: 'Áreas externas cobertas e descobertas' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'rodape-poliestireno',
    codigo: 'PIS-103',
    nome: 'Rodapé em Poliestireno 10cm Barra 2,40m',
    categoria: 'pisos',
    categoriaNome: 'Pisos e porcelanatos',
    descricao: 'Rodapé 100% resistente à água e imune a cupins. Pré-acabado pronto para instalação com cola ou presilhas, aceita pintura.',
    unidade: 'barra',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/rodape.jpg',
    alt: 'Barra de rodapé branco em poliestireno para acabamento',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'branco-liso', nome: 'Branco Liso (10cm)', detalhe: 'Design minimalista' },
      { id: 'branco-frisado', nome: 'Branco Frisado (10cm)', detalhe: 'Friso moderno superior' }
    ],
    especificacoes: [
      { chave: 'Comprimento da barra', valor: '2,40 metros' },
      { chave: 'Altura', valor: '10 cm' },
      { chave: 'Espessura', valor: '15 mm' },
      { chave: 'Material', valor: 'Poliestireno virgem reciclado' }
    ],
    demonstrativo: true,
    ativo: true
  },

  // TINTAS
  {
    id: 'tinta-acrilica-fosca-18l',
    codigo: 'TIN-201',
    nome: 'Tinta Acrílica Fosca Interior/Exterior 18L',
    categoria: 'tintas',
    categoriaNome: 'Tintas',
    descricao: 'Tinta acrílica de excelente rendimento e cobertura uniforme. Baixo odor e acabamento fosco suave que disfarça pequenas imperfeições da parede.',
    unidade: 'lata',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/tinta-acrilica.webp',
    alt: 'Lata de tinta acrílica interior e exterior 18 litros',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'branco-neve', nome: 'Branco Neve', detalhe: 'Luminosidade máxima' },
      { id: 'gelo', nome: 'Gelo', detalhe: 'Branco acinzentado neutro' },
      { id: 'palha', nome: 'Palha', detalhe: 'Tom aconchegante suave' },
      { id: 'algodao-egipcio', nome: 'Algodão Egípcio', detalhe: 'Tendência sofisticada' }
    ],
    especificacoes: [
      { chave: 'Volume', valor: '18 Litros (Balde)' },
      { chave: 'Rendimento estimado', valor: 'Até 300m² por demão (conforme parede)' },
      { chave: 'Secagem ao toque', valor: '2 horas' },
      { chave: 'Acabamento', valor: 'Fosco aveludado' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'esmalte-sintetico-3-6l',
    codigo: 'TIN-202',
    nome: 'Esmalte Sintético Brilhante para Madeiras e Metais 3,6L',
    categoria: 'tintas',
    categoriaNome: 'Tintas',
    descricao: 'Esmalte premium de proteção duradoura contra corrosão e desgaste. Cria uma película resistente e lavável em portas, portões, grades e janelas.',
    unidade: 'galão',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/esmalte-sintetico.jpg',
    alt: 'Galão de esmalte sintético brilhante 3,6 litros',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'esmalte-branco', nome: 'Branco', detalhe: 'Brilho reflexivo' },
      { id: 'esmalte-preto', nome: 'Preto', detalhe: 'Alta durabilidade externa' },
      { id: 'esmalte-cinza', nome: 'Cinza Médio', detalhe: 'Excelente para serralheria' }
    ],
    especificacoes: [
      { chave: 'Volume', valor: '3,6 Litros' },
      { chave: 'Aplicação', valor: 'Madeira, ferro, aço e alumínio' },
      { chave: 'Acabamento', valor: 'Brilhante' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'rolo-pintura-antigota',
    codigo: 'TIN-203',
    nome: 'Rolo de Pintura Antigota Microfibra 23cm com Cabo',
    categoria: 'tintas',
    categoriaNome: 'Tintas',
    descricao: 'Rolo de lã sintética microfibra antirrespingo. Proporciona espalhamento uniforme da tinta com mínimo de respingos no chão.',
    unidade: 'un',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/rolo-pintura.jpg',
    alt: 'Rolo de pintura profissional de 23cm com cabo anatômico',
    marca: 'Referência ilustrativa',
    especificacoes: [
      { chave: 'Largura do rolo', valor: '23 cm (9 polegadas)' },
      { chave: 'Altura da lã', valor: '10 mm (antigota)' },
      { chave: 'Acompanha', valor: 'Suporte metálico reforçado com cabo' }
    ],
    demonstrativo: true,
    ativo: true
  },

  // FERRAMENTAS
  {
    id: 'furadeira-impacto-bateria',
    codigo: 'FER-301',
    nome: 'Parafusadeira e Furadeira de Impacto a Bateria',
    categoria: 'ferramentas',
    categoriaNome: 'Ferramentas',
    descricao: 'Equipamento versátil com função impacto para alvenaria e controle de torque para parafusamento preciso. Acompanha maleta, baterias e carregador rápido bivolt.',
    unidade: 'un',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/furadeira.webp',
    alt: 'Furadeira e parafusadeira amarela e preta sem fio a bateria',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'bateria-12v', nome: '12V Max (Uso Doméstico e Montagem)', detalhe: 'Leve e compacta' },
      { id: 'bateria-20v', nome: '20V Max Brushless (Profissional)', detalhe: 'Motor sem escovas de carvão' }
    ],
    especificacoes: [
      { chave: 'Mandril', valor: '3/8" (10mm) de aperto rápido' },
      { chave: 'Funções', valor: 'Furadeira sem impacto, com impacto e parafusadeira' },
      { chave: 'Bateria', valor: 'Íons de Lítio (Li-Ion)' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'trena-aco-5m',
    codigo: 'FER-302',
    nome: 'Trena de Aço Emborrachada 5m com Trava',
    categoria: 'ferramentas',
    categoriaNome: 'Ferramentas',
    descricao: 'Trena profissional com fita de aço fosca antirreflexo, numeração de fácil leitura, estojo anatômico emborrachado com gancho magnético.',
    unidade: 'un',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/trena.jpg',
    alt: 'Trena de medição de 5 metros com corpo emborrachado',
    marca: 'Referência ilustrativa',
    especificacoes: [
      { chave: 'Comprimento', valor: '5 metros' },
      { chave: 'Largura da fita', valor: '19 mm' },
      { chave: 'Corpo', valor: 'ABS com cobertura de borracha' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'jogo-chaves-combinadas',
    codigo: 'FER-303',
    nome: 'Jogo de Chaves Combinadas 6 a 22mm em Aço Cromo-Vanádio',
    categoria: 'ferramentas',
    categoriaNome: 'Ferramentas',
    descricao: 'Conjunto de chaves combinadas (boca e estria) forjadas em aço cromo-vanádio temperado com acabamento niquelado e cromado fosco.',
    unidade: 'jg',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/chaves.jpg',
    alt: 'Jogo de chaves combinadas em estojo organizador',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'jogo-8-pecas', nome: 'Kit 8 peças (8 a 17mm)', detalhe: 'Medidas mais comuns' },
      { id: 'jogo-12-pecas', nome: 'Kit 12 peças (6 a 22mm)', detalhe: 'Linha mecânica completa' }
    ],
    especificacoes: [
      { chave: 'Material', valor: 'Aço Cromo-Vanádio (Cr-V)' },
      { chave: 'Acompanha', valor: 'Suporte plástico organizador de parede' }
    ],
    demonstrativo: true,
    ativo: true
  },

  // HIDRÁULICA
  {
    id: 'torneira-cozinha-bica-movel',
    codigo: 'HID-401',
    nome: 'Torneira de Mesa para Cozinha Bica Móvel Cromada',
    categoria: 'hidraulica',
    categoriaNome: 'Hidráulica',
    descricao: 'Torneira com acionamento cerâmico 1/4 de volta para máxima economia de água. Bica giratória 360° com arejador articulável embutido.',
    unidade: 'un',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/torneira.webp',
    alt: 'Torneira metálica cromada moderna para pia de cozinha',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'cromado', nome: 'Cromado Tradicional', detalhe: 'Metal brilhante polido' },
      { id: 'preto-fosco', nome: 'Preto Fosco (Matte)', detalhe: 'Pintura eletrostática fosca' }
    ],
    especificacoes: [
      { chave: 'Mecanismo', valor: 'Cerâmico 1/4 de volta' },
      { chave: 'Instalação', valor: 'Mesa / Bancada' },
      { chave: 'Bitola', valor: '1/2" com adaptador para 3/4"' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'tubo-pvc-soldavel-25mm',
    codigo: 'HID-402',
    nome: 'Tubo PVC Soldável Marrom 25mm (3/4") Barra 6m',
    categoria: 'hidraulica',
    categoriaNome: 'Hidráulica',
    descricao: 'Tubo rígido em PVC marrom para condução de água fria em instalações prediais e residenciais. Suporta pressão de serviço de até 7,5 kgf/cm².',
    unidade: 'barra',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/tubo-pvc.jpg',
    alt: 'Barras e conexões de tubos de PVC marrom e conexões hidráulicas',
    marca: 'Referência ilustrativa',
    especificacoes: [
      { chave: 'Diâmetro', valor: '25 mm (3/4")' },
      { chave: 'Comprimento', valor: '6 metros' },
      { chave: 'Norma técnica', valor: 'NBR 5648' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'caixa-dagua-polietileno',
    codigo: 'HID-403',
    nome: 'Caixa d’Água em Polietileno com Tampa Rosca',
    categoria: 'hidraulica',
    categoriaNome: 'Hidráulica',
    descricao: 'Reservatório atóxico com camada interna lisa antibacteriana facilitando a limpeza periódica. Tampa com travamento total por rosca contra insetos e poeira.',
    unidade: 'un',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/caixa-dagua.webp',
    alt: 'Caixa d’água azul em polietileno com tampa',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: '500-litros', nome: 'Capacidade 500 Litros', detalhe: 'Ideal para 2 a 3 pessoas' },
      { id: '1000-litros', nome: 'Capacidade 1.000 Litros', detalhe: 'Ideal para residências de 4 a 5 pessoas' }
    ],
    especificacoes: [
      { chave: 'Material', valor: 'Polietileno 100% virgem' },
      { chave: 'Garantia estrutural', valor: 'Conforme fabricante' },
      { chave: 'Fechamento', valor: 'Tampa click/rosca com vedação' }
    ],
    demonstrativo: true,
    ativo: true
  },

  // ELÉTRICA
  {
    id: 'cabo-flexivel-2-5mm',
    codigo: 'ELE-501',
    nome: 'Cabo Flexível Antichamas 750V Rolo 100m',
    categoria: 'eletrica',
    categoriaNome: 'Elétrica',
    descricao: 'Fio de cobre eletrolítico puro encapado com composto termoplástico antichama (PVC/A). Indicado para circuitos internos de iluminação, tomadas e força.',
    unidade: 'rolo',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/cabo-eletrico.webp',
    alt: 'Rolo de cabo elétrico flexível antichama 100 metros',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'bitola-1-5mm', nome: '1,5 mm² (Iluminação)', detalhe: 'Vermelho / Azul / Branco' },
      { id: 'bitola-2-5mm', nome: '2,5 mm² (Tomadas Gerais)', detalhe: 'Vermelho / Azul / Preto / Verde' },
      { id: 'bitola-4-0mm', nome: '4,0 mm² (Circuitos de Força)', detalhe: 'Vermelho / Azul / Preto' },
      { id: 'bitola-6-0mm', nome: '6,0 mm² (Chuveiros e Ar-condicionado)', detalhe: 'Vermelho / Azul' }
    ],
    especificacoes: [
      { chave: 'Comprimento', valor: 'Rolo fechado com 100 metros' },
      { chave: 'Tensão nominal', valor: '750V' },
      { chave: 'Norma técnica', valor: 'NBR NM 247-3 / Certificado Inmetro' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'tomada-10a-com-placa',
    codigo: 'ELE-502',
    nome: 'Conjunto Tomada 2P+T 10A com Placa 4x2 Branca',
    categoria: 'eletrica',
    categoriaNome: 'Elétrica',
    descricao: 'Módulo de tomada padrão brasileiro NBR 14136 com suporte e placa em policarbonato com proteção UV anti-amarelamento. Instalação rápida e acabamento sem parafusos aparentes.',
    unidade: 'un',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/tomada.jpg',
    alt: 'Placa de tomada elétrica padrão brasileira branca 10A',
    marca: 'Referência ilustrativa',
    especificacoes: [
      { chave: 'Corrente máxima', valor: '10 Amperes' },
      { chave: 'Tensão', valor: 'Até 250V~' },
      { chave: 'Formato', valor: 'Placa 4x2 com cantos suaves' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'lampada-led-bulbo',
    codigo: 'ELE-503',
    nome: 'Lâmpada LED Bulbo Bivolt Base E27',
    categoria: 'eletrica',
    categoriaNome: 'Elétrica',
    descricao: 'Lâmpada de alta eficiência luminosa com economia de até 85% de energia elétrica em comparação às antigas incandescentes. Não esquenta e acende instantaneamente.',
    unidade: 'un',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/lampada-led.jpg',
    alt: 'Lâmpada LED bulbo branca com base de rosca E27',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'led-9w-branco', nome: '9W Branco Frio (6500K)', detalhe: '810 lúmens' },
      { id: 'led-12w-branco', nome: '12W Branco Frio (6500K)', detalhe: '1050 lúmens' },
      { id: 'led-12w-neutro', nome: '12W Branco Neutro (4000K)', detalhe: '1050 lúmens (luz natural)' },
      { id: 'led-15w-branco', nome: '15W Branco Frio (6500K)', detalhe: '1350 lúmens (alta intensidade)' }
    ],
    especificacoes: [
      { chave: 'Soquete', valor: 'E27 padrão' },
      { chave: 'Tensão', valor: 'Bivolt automático (100–240V)' },
      { chave: 'Vida útil estimada', valor: '25.000 horas' }
    ],
    demonstrativo: true,
    ativo: true
  },

  // MATERIAIS BÁSICOS
  {
    id: 'cimento-portland-cp2-50kg',
    codigo: 'BAS-601',
    nome: 'Cimento Portland Composto CP II-Z-32 Saco 50kg',
    categoria: 'basicos',
    categoriaNome: 'Materiais básicos',
    descricao: 'Cimento versátil de alta resistência e secagem controlada. Indicado para fundações, baldrames, lajes, pilares, vigas, chapisco, emboço e assentamento de alvenaria.',
    unidade: 'sc',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/cimento.jpg',
    alt: 'Saco de cimento Portland CP II 50kg para construção',
    marca: 'Referência ilustrativa',
    especificacoes: [
      { chave: 'Peso do saco', valor: '50 kg' },
      { chave: 'Tipo', valor: 'CP II-Z-32 (com pozolana)' },
      { chave: 'Norma técnica', valor: 'ABNT NBR 16697' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'argamassa-colante-ac3-20kg',
    codigo: 'BAS-602',
    nome: 'Argamassa Colante AC-III Uso Interno e Externo 20kg',
    categoria: 'basicos',
    categoriaNome: 'Materiais básicos',
    descricao: 'Argamassa de alto desempenho com flexibilidade e aderência química superior. Essencial para assentamento de porcelanatos em pisos e paredes, fachadas e piscinas.',
    unidade: 'sc',
    permiteDecimal: false,
    quantidadeMinima: 1,
    incremento: 1,
    imagem: '/assets/produtos/argamassa.jpg',
    alt: 'Saco de argamassa colante AC-III 20kg para porcelanatos',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'ac3-cinza', nome: 'AC-III Cinza (20kg)', detalhe: 'Pisos e porcelanatos escuros e médios' },
      { id: 'ac3-branca', nome: 'AC-III Branca (20kg)', detalhe: 'Porcelanatos claros e pastilhas de vidro' }
    ],
    especificacoes: [
      { chave: 'Peso do saco', valor: '20 kg' },
      { chave: 'Classificação', valor: 'AC-III (alta aderência e deformabilidade)' },
      { chave: 'Norma técnica', valor: 'ABNT NBR 14081' }
    ],
    demonstrativo: true,
    ativo: true
  },
  {
    id: 'tijolo-ceramico-8-furos',
    codigo: 'BAS-603',
    nome: 'Tijolo Cerâmico 8 Furos 9x19x19cm',
    categoria: 'basicos',
    categoriaNome: 'Materiais básicos',
    descricao: 'Bloco cerâmico de vedação com excelente isolamento térmico e acústico. Ranhuras laterais para ótima aderência da massa de assentamento.',
    unidade: 'milheiro',
    permiteDecimal: true,
    quantidadeMinima: 0.5,
    incremento: 0.5,
    imagem: '/assets/produtos/tijolo.jpg',
    alt: 'Tijolo cerâmico avermelhado com 8 furos para alvenaria de vedação',
    marca: 'Referência ilustrativa',
    variantes: [
      { id: 'milheiro', nome: 'Milheiro (1.000 unidades)', detalhe: 'Para grandes etapas de alvenaria' },
      { id: 'meio-milheiro', nome: 'Meio Milheiro (500 unidades)', detalhe: 'Para reformas ou complementos' }
    ],
    especificacoes: [
      { chave: 'Dimensões nominais', valor: '9 cm x 19 cm x 19 cm' },
      { chave: 'Consumo médio', valor: 'Aprox. 25 a 27 peças por m² de parede' },
      { chave: 'Aplicação', valor: 'Alvenaria de vedação residencial e comercial' }
    ],
    demonstrativo: true,
    ativo: true
  }
];
