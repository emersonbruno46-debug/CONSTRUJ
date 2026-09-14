import { CategoryInfo } from '../types/catalog';

export const categoriesData: CategoryInfo[] = [
  {
    id: 'pisos',
    nome: 'Pisos e porcelanatos',
    descricao: 'Revestimentos, pisos cerâmicos e porcelanatos para áreas internas e externas.',
    imagem: '/assets/categorias/pisos.webp',
    icone: 'Layers'
  },
  {
    id: 'tintas',
    nome: 'Tintas',
    descricao: 'Tintas acrílicas, esmaltes, vernizes, impermeabilizantes e acessórios para pintura.',
    imagem: '/assets/categorias/tintas.webp',
    icone: 'Paintbrush'
  },
  {
    id: 'ferramentas',
    nome: 'Ferramentas',
    descricao: 'Ferramentas manuais e elétricas para construção, montagem e acabamentos.',
    imagem: '/assets/categorias/ferramentas.webp',
    icone: 'Wrench'
  },
  {
    id: 'hidraulica',
    nome: 'Hidráulica',
    descricao: 'Tubos, conexões, torneiras, caixas d’água e registros de qualidade.',
    imagem: '/assets/categorias/hidraulica.webp',
    icone: 'Droplets'
  },
  {
    id: 'eletrica',
    nome: 'Elétrica',
    descricao: 'Fios, cabos, disjuntores, tomadas, interruptores e iluminação LED.',
    imagem: '/assets/categorias/eletrica.webp',
    icone: 'Zap'
  },
  {
    id: 'basicos',
    nome: 'Materiais básicos',
    descricao: 'Cimento, argamassa, tijolos, areia, brita e aço para a estrutura da obra.',
    imagem: '/assets/categorias/basicos.webp',
    icone: 'Building2'
  }
];
