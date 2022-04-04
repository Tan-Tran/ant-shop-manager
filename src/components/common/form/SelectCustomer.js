import { Select } from 'antd';

const { Option } = Select;

const SelectCustomer = ({ customers, selectCustomerHandler }) => {
  return (
    <Select
      showSearch
      style={{ width: 300 }}
      placeholder="Search customer"
      optionLabelProp="label"
      optionFilterProp="children"
      onChange={selectCustomerHandler}
      filterOption={(input, option) =>
        option.children.props.children[0].props.children[1]
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      }
      filterSort={(optionA, optionB) =>
        optionA.children.props.children[0].props.children[1]
          .toLowerCase()
          .localeCompare(
            optionB.children.props.children[0].props.children[1].toLowerCase()
          )
      }
    >
      {customers.map((customer) => {
        return (
          <Option value={customer.key} key={customer.key} label={customer.name}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 10,
                  width: 100,
                }}
              >
                Name: {customer.name}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 10,
                  width: 150,
                }}
              >
                Phone: {customer.phone}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 10,
                  width: 150,
                }}
              >
                Birth: {customer.dateOfBirth}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 10,
                  width: 100,
                }}
              >
                Address: {customer.address}
              </span>
            </div>
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectCustomer;
