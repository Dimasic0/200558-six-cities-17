const Ul = ({ ulProps, liGeneralProps, values}) => {
  const liGeneralPropsType = typeof liGeneralProps;
  const classGeneral = liGeneralPropsType === 'object' ? liGeneralProps?.className : '';
  if (liGeneralPropsType === 'string') {
    liGeneralProps = { children: liGeneralProps };
  }
  return (
    <ul {...ulProps}>
      {
        values.map((value) => {
          const valueType = typeof value;
          if (valueType === 'object') value = { ...value };
          const classMod = value?.className || '';
          if (valueType === 'string') {
            value = { children: value };
          }
          console.log('liGeneralProps=', liGeneralProps);
          for (const prop in liGeneralProps) {
            value[prop] = liGeneralProps[prop]+ ' ' + (value?.[prop] || '');
          }
          // value.className = `${classGeneral} ${classMod}` ;
          // value.children = value?.children || value;

          return (<li {...value}/>);
        })
      }
    </ul>
  );
};

export { Ul };
