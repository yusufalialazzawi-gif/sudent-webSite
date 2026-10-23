import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

// Ana sayfa bölümlerinin sırası ve görünürlüğü admin panelindeki "Sayfa Bölümleri"nden gelir.
// Veri gelmezse tüm bölümler varsayılan sırayla gösterilir.
export function useHomeSections() {
  const { data } = useQuery({
    queryKey: ['home-page-sections'],
    queryFn: () => api.getPageSections('home'),
    staleTime: 5 * 60 * 1000,
  });

  const sections = data?.data || [];
  const order = sections.map((s) => s.sectionKey).filter(Boolean);
  const visible = new Set(order);

  const isVisible = (key) => (order.length === 0 ? true : visible.has(key));
  const title = (key) => sections.find((s) => s.sectionKey === key) || null;

  return { order, isVisible, title, hasCustomOrder: order.length > 0 };
}

export default useHomeSections;
