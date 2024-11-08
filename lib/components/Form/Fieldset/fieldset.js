import React from 'react';
import { node, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './container.module.css';

const Fieldset = props => {
    const { children } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    return <fieldset className={classes.root}>{children}</fieldset>;
};

Fieldset.propTypes = {
    classes: shape({ root: string }),
    children: node.isRequired
};

Fieldset.defaultProps = {};
export default Fieldset;
