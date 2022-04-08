import { Form, Table } from 'antd';
import EditableCell from '../../common/table/EditTableCellDemo';

const EditTable = (props) => {
  const { form, columns, dataSource, pagination, editable, ...restProps } =
    props;

  const { isEditing, onChange } = editable;

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
        editing: isEditing(record),
        onChange: onChange,
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
