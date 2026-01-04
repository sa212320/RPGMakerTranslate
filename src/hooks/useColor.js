export const useColor = () => {
  const style = window.getComputedStyle(document.body);

  return {
    primaryColor: style.getPropertyValue('--el-color-primary'),
    successColor: style.getPropertyValue('--el-color-success'),
    warningColor: style.getPropertyValue('--el-color-warning'),
    dangerColor: style.getPropertyValue('--el-color-danger'),
    infoColor: style.getPropertyValue('--el-color-info'),
  };
};

export default useColor;
