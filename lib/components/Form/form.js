import React from 'react';
import { node, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './form.module.css';

const Form = props => {
    const { children, ...rest } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div {...rest} className={classes.root}>
            {children}
        </div>
    );
};

Form.propTypes = {
    classes: shape({ root: string }),
    children: node.isRequired
};
Form.defaultProps = {};
export default Form;
