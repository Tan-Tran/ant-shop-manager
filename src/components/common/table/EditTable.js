import React, { useEffect, useState } from 'react';
import { Form, Table, DatePicker } from 'antd';
import EditableCell from '../../common/table/EditTableCellDemo';
import moment from 'moment';
import { FormatDate_DD_MM_YYY } from '../../format/date/FormatDate';

const covertDataTypeDatePicker = (data, columns) => {
  for (const column of columns) {
    if (column.inputType === DatePicker) {
      return {
        ...data,
        [`${column.dataIndex}`]: moment(
          data[column.dataIndex],
          FormatDate_DD_MM_YYY
        ),
      };
    }
  }
};

const EditTable = (props) => {
  const {
    form,
    columns,
    dataSource,
    pagination,
    type,
    onEdit,
    setEditingKeys,
    isEditing,
    ...restProps
  } = props;

  useEffect(() => {
    if (dataSource) {
      if (type === 'multiple') {
        for (const data of dataSource) {
          form.setFieldsValue({
            [`${data.key}`]: {
              ...data,
              ...covertDataTypeDatePicker(data, columns),
            },
          });
        }
      }
    }
  }, [dataSource]);

  const mergeColumns = columns.map((column) => {
    if (!column.editable) {
      return column;
    }
    return {
      ...column,
      onCell: (record) => ({
        record,
        editable: column.editable,
        inputType: column.inputType,
        dataIndex: column.dataIndex,
        title: column.title,
        onEdit: onEdit,
        editing:
          type === 'multiple' ? true : isEditing ? isEditing(record) : false,
        formItemProps: column.formItemProps,
        elementProps: column.elementProps,
      }),
    };
  });

  return (
    <Form form={form}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        columns={mergeColumns}
        dataSource={dataSource}
        pagination={pagination}
        {...restProps}
      />
    </Form>
  );
};

export default EditTable;
