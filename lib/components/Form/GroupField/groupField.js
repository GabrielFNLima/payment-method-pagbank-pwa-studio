import React from 'react';
import { node, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './groupField.module.css';

const GroupField = props => {
    const { children } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    return <div className={classes.root}>{children}</div>;
};

GroupField.propTypes = {
    classes: shape({ root: string }),
    children: node.isRequired
};
GroupField.defaultProps = {};
export default GroupField;
