const helpers = [
  require('./leonardo/index.js').default,
]

const flattenComponents = () => {
  return helpers.reduce((allComponents, helper) => {
    const { components, namespace } = helper;
    return Object.keys(components).reduce((allComponents, key) => {
      allComponents[`${namespace}-${key}`] = components[key]
      return allComponents;
    }, allComponents)
  }, [])
}

export default flattenComponents()
