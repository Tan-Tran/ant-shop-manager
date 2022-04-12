import React, { useEffect, useState } from 'react';
import EditableCell from '../../common/table/EditTableCellDemo';
import moment from 'moment';
import { FormatDate_DD_MM_YYY } from '../../format/date/FormatDate';
import { Table, Form, DatePicker, Popconfirm, Typography, Space } from 'antd';

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
    columns,
    dataSource,
    pagination,
    type,
    onSave,
    onAdd,
    onUpdate,
    onDelete,
    onEdit,
    onCancel,
    ...restProps
  } = props;

  const [form] = Form.useForm();

  const [dataSourceTable, setDataSourceTable] = useState(dataSource);

  const [editingKeys, setEditingKeys] = useState([]);

  const isEditing = (record) => {
    return editingKeys.find((item) => item === record.key) ? true : false;
  };

  const checkEditing = (type, record) => {
    if (type === 'multiple') {
      return true;
    } else {
      return record.isNew || isEditing(record);
    }
  };

  useEffect(() => {
    setDataSourceTable(dataSource);
  }, [dataSource]);

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

  const edit = (record) => {
    form.setFieldsValue({
      [`${record.key}`]: {
        ...record,
        ...covertDataTypeDatePicker(record, columns),
      },
    });
  };

  // const cancel = (record) => {
  //   if (record.isNew) {
  //     setDataSourceTable(
  //       [...dataSourceTable].filter((item) => item.key !== record.key)
  //     );
  //   }
  // };

  const columnsTable = [
    ...columns,
    {
      title: 'Action',
      dataIndex: 'action',
      style: {
        width: '20%',
      },
      render: (_, record) => {
        const editable = checkEditing(type, record);
        if (type) {
          return (
            <Typography.Link
              disabled={editingKeys.length !== 0}
              onClick={() => onDelete(record.key)}
            >
              Delete
            </Typography.Link>
          );
        }
        return editable ? (
          <span>
            <Typography.Link
              onClick={async () => {
                await form.validateFields();
                setEditingKeys([]);
                onSave({
                  key: record.key,
                  data: form.getFieldValue(record.key),
                  method: record.isNew ? 'POST' : 'PUT',
                });
              }}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => {
                setEditingKeys([]);
                onCancel(record.key);
              }}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Space>
              <Typography.Link
                disabled={editingKeys.length !== 0}
                onClick={() => {
                  setEditingKeys([record.key]);
                  edit(record);
                }}
              >
                Edit
              </Typography.Link>
              <Typography.Link
                disabled={editingKeys.length !== 0}
                onClick={() => onDelete(record.key)}
              >
                Delete
              </Typography.Link>
            </Space>
          </span>
        );
      },
    },
  ];

  const mergeColumns = columnsTable.map((column) => {
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
        form: form,
        onEdit: onEdit,
        editing: checkEditing(type, record),
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
        dataSource={dataSourceTable}
        pagination={pagination}
        {...restProps}
      />
    </Form>
  );
};

export default EditTable;
