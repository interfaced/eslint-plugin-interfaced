const {errors, concat, extendClassDeclarations} = require(`../helper`);

module.exports = extendClassDeclarations({
	valid: [{
		options: [{
			scopesOrder: ['public', 'protected', 'private'],
			staticInTheEnd: true
		}],
		code: concat(
			`class Klass1 {`,
			`   constructor() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   overriddenPublicMethod() {}`,
			``,
			`   publicMethodWithoutAnnotation() {}`,
			``,
			`   /**`,
			`    * @public`,
			`    */`,
			`   publicMethod() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   _overriddenPrivateOrProtectedMethod() {}`,
			``,
			`   /**`,
			`    * @protected`,
			`    */`,
			`   _protectedMethod() {}`,
			``,
			`   /**`,
			`    * @private`,
			`    */`,
			`   _privateMethod() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   static staticOverriddenPublicMethod() {}`,
			``,
			`   static staticPublicMethodWithoutAnnotation() {}`,
			``,
			`   /**`,
			`    * @public`,
			`    */`,
			`   static staticPublicMethod() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   static _overriddenStaticPrivateOrProtectedMethod() {}`,
			``,
			`   /**`,
			`    * @protected`,
			`    */`,
			`   static _staticProtectedMethod() {}`,
			``,
			`   /**`,
			`    * @private`,
			`    */`,
			`   static _staticPrivateMethod() {}`,
			`}`,
			``,
			`class Klass2 {`,
			`   constructor() {}`,
			`}`
		)
	}, {
		options: [{
			scopesOrder: ['public', 'protected', 'private'],
			staticInTheEnd: false
		}],
		code: concat(
			`class Klass {`,
			`   constructor() {}`,
			``,
			`   /**`,
			`    * @public`,
			`    */`,
			`   static staticPublicMethod() {}`,
			``,
			`   /**`,
			`    * @public`,
			`    */`,
			`   publicMethod() {}`,
			``,
			`   /**`,
			`    * @protected`,
			`    */`,
			`   _protectedMethod() {}`,
			``,
			`   /**`,
			`    * @private`,
			`    */`,
			`   _privateMethod() {}`,
			`}`
		)
	}],
	invalid: [{
		options: [{
			scopesOrder: ['public', 'protected', 'private'],
			staticInTheEnd: true
		}],
		code: concat(
			`class Klass {`,
			`   static staticPublicMethodWithoutAnnotation() {}`,
			``,
			`   constructor() {}`,
			``,
			`   /**`,
			`    * @private`,
			`    */`,
			`   _privateMethod() {}`,
			``,
			`   /**`,
			`    * @protected`,
			`    */`,
			`   _protectedMethod() {}`,
			``,
			`   publicMethodWithoutAnnotation() {}`,
			``,
			`   /**`,
			`    * @public`,
			`    */`,
			`   publicMethod() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   overriddenPublicMethod() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   _overriddenPrivateOrProtectedMethod() {}`,
			``,
			`   /**`,
			`    * @private`,
			`    */`,
			`   static _staticPrivateMethod() {}`,
			``,
			`   /**`,
			`    * @protected`,
			`    */`,
			`   static _staticProtectedMethod() {}`,
			``,
			`   /**`,
			`    * @public`,
			`    */`,
			`   static staticPublicMethod() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   static staticOverriddenPublicMethod() {}`,
			``,
			`   /**`,
			`    * @override`,
			`    */`,
			`   static _overriddenStaticPrivateOrProtectedMethod() {}`,
			`}`
		),
		/* eslint-disable max-len */
		errors: errors(
			`Method "staticPublicMethodWithoutAnnotation" is static and should be in the end of class body.`,
			`Constructor method should be first in the class body.`,
			`Method "_protectedMethod" (protected) should be before method "_privateMethod" (private) due to its priority.`,
			`Method "publicMethodWithoutAnnotation" (public) should be before method "_protectedMethod" (protected) due to its priority.`,
			`Method "overriddenPublicMethod" should be before "publicMethod" because of "overriddenPublicMethod" is overridden.`,
			`Method "_staticProtectedMethod" (protected) should be before method "_staticPrivateMethod" (private) due to its priority.`,
			`Method "staticPublicMethod" (public) should be before method "_staticProtectedMethod" (protected) due to its priority.`,
			`Method "staticOverriddenPublicMethod" should be before "staticPublicMethod" because of "staticOverriddenPublicMethod" is overridden.`
		)
		/* eslint-enable */
	}]
});
