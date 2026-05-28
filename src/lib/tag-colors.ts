/**
 * Material You 标签颜色色板
 * 使用柔和的容器颜色，确保文字可读性
 */
const TAG_COLORS = [
  { bg: '#EADDFF', text: '#21005D' }, // primary-container
  { bg: '#E8DEF8', text: '#1D192B' }, // secondary-container
  { bg: '#FFD8E4', text: '#31111D' }, // tertiary-container
  { bg: '#D0BCFF', text: '#381E72' }, // primary (lighter)
  { bg: '#CCC2DC', text: '#332D41' }, // secondary (lighter)
  { bg: '#EFB8C8', text: '#492532' }, // tertiary (lighter)
  { bg: '#B3E5FC', text: '#01579B' }, // blue
  { bg: '#C8E6C9', text: '#1B5E20' }, // green
  { bg: '#FFE0B2', text: '#E65100' }, // orange
  { bg: '#F8BBD0', text: '#880E4F' }, // pink
];

/**
 * 简单的字符串哈希函数
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * 根据标签名生成颜色
 */
export function getTagColor(tagName: string): { bg: string; text: string } {
  const hash = hashString(tagName);
  const index = hash % TAG_COLORS.length;
  return TAG_COLORS[index];
}
