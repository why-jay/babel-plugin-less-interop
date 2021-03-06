const importLessVarsWithImportResolution =
  require('./importLessVarsWithImportResolution');

export default function ({ types: t }) {
  return {
    visitor: {
      Program(path, state) {

        const requiredPropsInOpts = [
          'lessFile',
          'memberExprObjName'
        ];

        requiredPropsInOpts.forEach(prop => {
          if (state.opts[prop] === undefined) {
            throw new Error(
              `babel-plugin-less-interop: You have to provide option ${prop}` +
                ` in your plugin definition.`);
          }
        });

      },
      MemberExpression(path, state) {

        const lessVars =
          importLessVarsWithImportResolution(state.opts.lessFile);

        if (path.node.object.name === state.opts.memberExprObjName) {
          const propName = path.node.property.name;
          const lessValue = lessVars[propName];

          if (lessValue === undefined) {
            throw path.buildCodeFrameError(
              `babel-plugin-less-interop: Property ${propName} cannot be` +
                ` extracted from the given LESS file.`);
          }

          if (isFinite(lessValue)) {

            path.replaceWith(t.NumericLiteral(lessValue));

          } else {
            // less-interop will only return numbers or strings.

            path.replaceWith(t.StringLiteral(lessValue));

          }
        }

      }
    }
  }
}
