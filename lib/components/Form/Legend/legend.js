import React from 'react';
import { node, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './legend.module.css';

const Legend = props => {
    const { children } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    return <legend className={classes.root}>{children}</legend>;
};

Legend.propTypes = {
    classes: shape({ root: string }),
    children: node.isRequired
};
Legend.defaultProps = {};
export default Legend;
