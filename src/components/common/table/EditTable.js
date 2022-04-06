import {Form, Table} from 'antd'
import EditableCell from '../../common/table/EditTableCellDemo'

const EditTable = (props) =>{
    const {form, columns, dataSource, ...restProps} = props
    return(
        <Form form={form}>
            <Table
                components = {{
                    body:{
                        cell: EditableCell
                    }
                }}
                columns = {columns} 
                dataSource = {dataSource}                
                {...restProps}
            />
        </Form>
    )
}

export default EditTable