# Constru J — Catálogo e Site Institucional

Aplicação web moderna, responsiva e acessível desenvolvida para a **Constru J**, loja de materiais de construção e acabamentos em **Rio Pardo de Minas – MG**.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** + **TypeScript**
- **Vite** para empacotamento ultrarrápido
- **Lucide React** para iconografia consistente
- **Vanilla CSS (Design Tokens)**:
  - Paleta com verde oficial `#17AE13`, verde acessível para botões `#16752A`, laranja `#FF8011`, fundos `#F5F6F3` e textos `#202820`
  - Totalmente adaptado para celulares (360px+), tablets e telas desktop

---

## ✨ Funcionalidades Principais

1. **Catálogo Interativo de Materiais**:
   - Busca em tempo real sem sensibilidade a acentos ou maiúsculas.
   - Filtro por 6 categorias: *Pisos e porcelanatos*, *Tintas*, *Ferramentas*, *Hidráulica*, *Elétrica* e *Materiais básicos*.
   - Modal de detalhes com ficha técnica, especificações e seleção de opções/variantes.
2. **Sistema "Meu Orçamento"**:
   - Adição e controle de quantidades (suporta números inteiros e decimais para m²).
   - Campo de observações (até 500 caracteres).
   - Persistência no navegador via `localStorage`.
   - **Solicitação direta pelo WhatsApp**: formatação de mensagem com código, produto, variante e quantidades, sem totalizadores fictícios.
   - Botão para copiar a lista para a área de transferência.
3. **Institucional e Localização**:
   - Galeria com fotos reais da loja física e fachada.
   - Endereço, horários de atendimento e link direto para o Google Maps ("Como chegar").
   - Informações de meios de pagamento aceitos no balcão presencial.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado.

### Instalação e Execução
```bash
# Instalar dependências
npm install

# Iniciar servidor local de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

---

## 📍 Informações da Loja

- **Nome**: Constru J
- **Slogan**: *A mais completa e preferida*
- **Localização**: Rio Pardo de Minas – MG
- **WhatsApp**: (38) 99121-4662
- **Endereço**: Rua Tácito de Freitas Costa, 414 — Cidade Alta
