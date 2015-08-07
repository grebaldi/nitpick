function factory (global, factoryOpts) {
    /**
     * @private
     *
     * Checks if the given argument is a function.
     *
     * @param func {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isFunction (func) {
        return typeof func === 'function';
    }

    /**
     * @private
     *
     * Checks if the given argument is a Number.
     *
     * @param num {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isNumeric (num) {
        return !isNaN(num);
    }

    /**
     * @private
     *
     * Checks if the given argument is a boolean or a string containing a boolean.
     *
     * @param bol {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isBoolean (bol) {
        return typeof bol === 'boolean' || bol === 'true' || bol === 'false';
    }

    /**
     * @private
     *
     * Checks if the given argument is a object.
     *
     * @param obj {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isObject (obj) {
        return typeof obj === 'object';
    }

    /**
     * @private
     *
     * Checks if the given argument is a string.
     *
     * @param str {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isString (str) {
        return typeof str === 'string';
    }

    /**
     * @private
     *
     * Checks if the given argument is defined and not `null`.
     *
     * @param val {*} The argument which will be validated.
     * @returns {boolean}
     *
     */
    function _isDefined (val) {
        return val !== null && val !== undefined;
    }

    /**
     * Converts a string containing a boolean to a real boolean if necessary.
     * @param val
     * @returns {*}
     * @private
     */
    function _convertStringBoolean (val) {
        if (val === 'false') {
            val = false;
        }

        if (val === 'true') {
            val = true;
        }

        return val;
    }

    const logger = {
        _logLevel: 2,

        /**
         * Adjusts the noise of the logger.
         * 0 => No messages are displayed
         * 1 => Only severe messages are displayed
         * 2 => Every message is displayed
         *
         * @param int {Number} The new log level.
         * @returns {Void}
         *
         */
        setLogLevel: (int) => {
            logger._logLevel = _isNumeric(int) ? int : 2;
        },

        /**
         * Logs a message to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param targetElement {HTMLElement} An optional target element which will be appended to the log.
         * @returns {Void}
         *
         */
        log: (message, targetElement = '') => {
            if (logger._logLevel <= 2) {
                return;
            }

            try {
                console.log('@reduct/component: ' + message, targetElement);
            } catch (e) {}
        },

        /**
         * Logs a info to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param targetElement {HTMLElement} An optional target element which will be appended to the info.
         * @returns {Void}
         *
         */
        info: (message, targetElement = '') => {
            if (logger._logLevel <= 2) {
                return;
            }

            try {
                console.info('@reduct/component Info: ' + message, targetElement);
            } catch (e) {}
        },

        /**
         * Logs a warning to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param targetElement {HTMLElement} An optional target element which will be appended to the warning.
         * @returns {Void}
         *
         */
        warn: (message, targetElement = '') => {
            if (logger._logLevel <= 1) {
                return;
            }

            try {
                console.warn('@reduct/component Warning: ' + message, targetElement);
            } catch (e) {}
        },

        /**
         * Logs a error to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param targetElement {HTMLElement} An optional target element which will be appended to the error.
         * @returns {Void}
         *
         */
        error: (message, targetElement = '') => {
            if (logger._logLevel <= 0) {
                return;
            }

            try {
                // We still need the console.error call since the Error object can't print out references to HTML Elements.
                console.error(message, targetElement);
            } catch (e) {}

            throw new Error('@reduct/component Error: Details are posted above.');
        }
    };

    //
    // Reduce the logging noise for the unit tests.
    //
    if (factoryOpts.isTestingEnv) {
        logger.setLogLevel(0);
    }

    const propTypes = {
        /**
         * Represents a general required check against a value.
         *
         * @param propValue {*} The value which will be validated.
         * @param propName {String} The name which will be logged in case of errors.
         * @param el {HTMLElement} The element on which the value was expected on.
         * @returns {{result: boolean, value: *}}
         *
         */
        isRequired: (propValue, propName, el) => {
            const isPropInProps = _isDefined(propValue);

            if (!isPropInProps) {
                logger.error('The prop "' + propName + '" is required and wasn‘t found on: ', el);
            }

            return {
                result: isPropInProps,
                value: propValue
            };
        },

        /**
         * Represents a general optional check against a value.
         *
         * @param propValue {*} The value which will be validated.
         * @param propName{String} The name which will be logged in case of errors.
         * @param el {HTMLElement} The element on which the value was expected on.
         * @returns {{result: boolean, value: *}}
         *
         */
        isOptional: (propValue, propName, el) => {
            const isPropInProps = _isDefined(propValue);

            if (!isPropInProps) {
                logger.info('The prop "' + propName + '" is optional and wasn‘t found on: ', el);
            }

            return {
                result: true,
                value: propValue
            };
        },

        isString: {
            /**
             * Extends the general required validator for the type `String`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isRequired: (propValue, propName, el) => {
                const isString = _isString(propValue);
                let result = true;

                propTypes.isRequired.apply(this, arguments);

                if (!isString) {
                    logger.error('The prop "' + propName + '" is not a string. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            },

            /**
             * Extends the general optional validator for the type `String`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isOptional: (propValue, propName, el) => {
                const isString = _isString(propValue);
                let result = true;

                if (!isString) {
                    logger.error('The prop "' + propName + '" is not a string. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            }
        },

        isBoolean: {
            /**
             * Extends the general required validator for the type `Boolean`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isRequired: (propValue, propName, el) => {
                const isBoolean = _isBoolean(propValue);
                let result = true;

                propTypes.isRequired.apply(this, arguments);

                if (!isBoolean) {
                    logger.error('The prop "' + propName + '" is not a boolean. ', el);
                    result = false;
                }

                propValue = _convertStringBoolean(propValue);

                return {
                    result: result,
                    value: propValue
                };
            },

            /**
             * Extends the general optional validator for the type `Boolean`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isOptional: (propValue, propName, el) => {
                const isBoolean = _isBoolean(propValue);
                let result = true;

                if (!isBoolean) {
                    logger.error('The prop "' + propName + '" is not a boolean. ', el);
                    result = false;
                }

                propValue = _convertStringBoolean(propValue);

                return {
                    result: result,
                    value: propValue
                };
            }
        },

        isNumber: {
            /**
             * Extends the general required validator for the type `Number`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isRequired: (propValue, propName, el) => {
                const isNumber = _isNumeric(propValue);
                let result = true;

                // Since The prop is required, check for it's value beforehand.
                propTypes.isRequired.apply(this, arguments);

                if (!isNumber) {
                    logger.error('The prop "' + propName + '" is not a number. ', el);
                    result = false;
                } else {
                    propValue = Math.abs(propValue);
                }

                return {
                    result: result,
                    value: propValue
                };
            },

            /**
             * Extends the general optional validator for the type `Number`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isOptional: (propValue, propName, el) => {
                const isNumber = _isNumeric(propValue);
                let result = true;

                if (propValue && !isNumber) {
                    logger.error('The prop "' + propName + '" is not a number. ', el);
                    result = false;
                }

                propValue = Math.abs(propValue);

                return {
                    result: result,
                    value: _isNumeric(propValue) ? propValue : undefined
                };
            }
        },

        isObject: {
            /**
             * Extends the general required validator for the type `Object`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isRequired: (propValue, propName, el) => {
                let result = true;
                let isObject;

                // Since The prop is required, check for it's value beforehand.
                propTypes.isRequired.apply(this, arguments);

                // If the passed Property is a string, convert it to a JSON object beforehand.
                try {
                    propValue = JSON.parse(propValue);
                } catch (e) {}

                // Verify the type of the value.
                isObject = _isObject(propValue);

                if (!isObject) {
                    logger.error('The prop "' + propName + '" is not an valid JSON object. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            },

            /**
             * Extends the general optional validator for the type `Object`.
             *
             * @param propValue {*} The value which will be validated.
             * @param propName {String} The name which will be logged in case of errors.
             * @param el {HTMLElement} The element on which the value was expected on.
             * @returns {{result: boolean, value: *}}
             *
             */
            isOptional: (propValue, propName, el) => {
                const isPropValueDefined = _isDefined(propValue);
                let result = true;
                let isObject;

                // If the passed Property is a string, convert it to a JSON object beforehand.
                try {
                    propValue = JSON.parse(propValue);
                } catch (e) {}

                // Verify the type of the value.
                isObject = _isObject(propValue);

                if (isPropValueDefined && !isObject) {
                    logger.error('The prop "' + propName + '" is not an valid JSON object. ', el);
                    result = false;
                }

                return {
                    result: result,
                    value: propValue
                };
            }
        },

        version: factoryOpts.packageVersion
    };

    return propTypes;
}
