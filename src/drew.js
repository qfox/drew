(function(exports){
  var logging = typeof Drew === 'object' ? Drew.logging : require('./logging').logging;
  var compileDrew = typeof Drew === 'object' ? Drew.compileDrew : require('./compile').compileDrew;
  var runDrew = typeof Drew === 'object' ? Drew.runDrew : require('./runtime').runDrew;

  /**
   * @param {Array.<{value:string}>} tokens Each token should at least have a .value property containing the string value
   * @param {string} query
   * @param {Object} macros
   * @param {Object} constants
   * @param {Function} callback
   * @param {Object} options
   * @property {string} [options.repeatMode='once'] once, after, every. Continue after a match? last start + 1 or at prev match end + 1?
   * @property {string} [options.returnMode='token'] token, index. Pass tokens or their (white) index to callbacks?
   * @property {number} [options.verboseMode=0] 0=none, 1=hi, 2=med, 3=low
   */
  function drew(tokens, query, macros, constants, callback, options) {
    if (!options) options = {};
    else logging.setMode(options.verboseMode);

    if (!macros.IS_BLACK && !constants.IS_BLACK) throw new Error('Must always declare a macro or constant for IS_BLACK');
    if (!macros.IS_NEWLINE && !constants.IS_NEWLINE) throw new Error('Must always declare a macro or constant for IS_NEWLINE');

    var funcCode = compileDrew(query);
    var func = compileDrew(funcCode, true, true);

    var repeatMode = options.repeatMode || 'once';
    var returnIndexOnly = options.returnMode === 'index';

    runDrew(func, tokens, macros, constants, callback, repeatMode, returnIndexOnly);
  }

  exports.drew = drew;
})(typeof module === 'object' ? module.exports : window.Drew);
