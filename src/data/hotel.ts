export type Room = { id: string; name: string; eyebrow: string; price: number; size: string; sleeps: string; image: string; description: string; amenities: string[] };

export const rooms: Room[] = [
  { id: 'garden', name: 'Garden Verandah', eyebrow: 'The unhurried room', price: 480, size: '38 m²', sleeps: '2 guests', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85', description: 'A private verandah opens to rain trees, soft daylight, and the low rhythm of the garden.', amenities: ['King bed', 'Verandah', 'Rain shower'] },
  { id: 'heritage', name: 'Heritage Suite', eyebrow: 'The generous room', price: 690, size: '56 m²', sleeps: '3 guests', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85', description: 'Original tiles and tall shuttered windows frame a living room made for lingering afternoons.', amenities: ['King bed', 'Sitting room', 'Soaking tub'] },
  { id: 'terrace', name: 'Terrace Residence', eyebrow: 'The long-stay room', price: 920, size: '74 m²', sleeps: '4 guests', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85', description: 'A home-like stay with a pantry, wide terrace, and space for an unplanned extra night.', amenities: ['2 bedrooms', 'Pantry', 'Private terrace'] },
];

export const services = [
  ['The garden table', 'Breakfast is a slow affair: tropical fruit, warm pastries and dishes cooked to order.'],
  ['House wellness', 'Private treatments, a small lap pool, and no schedule worth rushing for.'],
  ['Made in Penang', 'A resident curator shapes walks through ateliers, hawker lanes, and hidden galleries.'],
];
