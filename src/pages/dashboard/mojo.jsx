import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Select,
  Option,
  Switch,
  Checkbox,
  Textarea,
} from "@material-tailwind/react";
import { PlusIcon, MinusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function Mojo() {
  const [formData, setFormData] = useState({
    token: '',
    status: 'active',
    columns: '',
    table: '',
    prefix: '',
    endpoint: '',
    comment: '',
    data: '',
    permissions: '',
    sql: '',
    function: '',
    role: '',
    method: '',
    select: '',
    rpc: '',
    single: false,
    log: false,
    text: '',
    methods: {},
    name: '',
    is_active: true,
    selects: '',
    files: '',
    embedding: '',
    jwt: '',
    userId: '',
    version: '1.1',
    checker: false,
    html: '',
  });

  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (formData.token) {
      fetchTables();
      fetchRoles();
    }
  }, [formData.token]);

  useEffect(() => {
    if (formData.table) {
      fetchColumns();
    }
  }, [formData.table]);

  const fetchTables = async () => {
    try {
      const response = await fetch(`https://mojoland.deno.dev/api/getAllTables?token=${formData.token}`);
      const data = await response.json();
      setTables(data.data.map(t => t.table_name));
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchColumns = async () => {
    try {
      const response = await fetch(`https://mojoland.deno.dev/api/get_type_table?table=${formData.table}&token=${formData.token}`);
      const data = await response.json();
      setColumns(['*', ...data.data.map(c => c.column_name)]);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`https://mojoland.deno.dev/api/role?token=${formData.token}`);
      const data = await response.json();
      setRoles(data.map(r => r.name));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMethodChange = (method, enabled) => {
    setFormData(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: enabled ? { permissions: [], filters: {} } : undefined
      }
    }));
  };

  const handlePermissionChange = (method, permission) => {
    setFormData(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: {
          ...prev.methods[method],
          permissions: prev.methods[method].permissions.includes(permission)
            ? prev.methods[method].permissions.filter(p => p !== permission)
            : [...prev.methods[method].permissions, permission]
        }
      }
    }));
  };

  const handleFilterChange = (method, filterType, column) => {
    setFormData(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: {
          ...prev.methods[method],
          filters: {
            ...prev.methods[method].filters,
            [filterType]: prev.methods[method].filters[filterType]?.includes(column)
              ? prev.methods[method].filters[filterType].filter(c => c !== column)
              : [...(prev.methods[method].filters[filterType] || []), column]
          }
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setShowResult(true);
  };

  return (
    <Card className="mx-3 mt-8 mb-6 lg:mx-4 border border-blue-gray-100" dir="rtl">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <Input
          type="text"
          name="token"
          label="Token"
          value={formData.token}
          onChange={handleInputChange}
          required
        />

        <Select
          label="جدول"
          name="table"
          value={formData.table}
          onChange={(value) => handleInputChange({ target: { name: 'table', value } })}
          required
        >
          {tables.map((table) => (
            <Option key={table} value={table}>{table}</Option>
          ))}
        </Select>

        <Select
          label="أعمدة"
          name="columns"
          value={formData.columns}
          onChange={(value) => handleInputChange({ target: { name: 'columns', value } })}
          multiple
          required
        >
          {columns.map((column) => (
            <Option key={column} value={column}>{column}</Option>
          ))}
        </Select>

        <Input
          type="text"
          name="endpoint"
          label="نقطة النهاية"
          value={formData.endpoint}
          onChange={handleInputChange}
          required
        />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">الطرق</h3>
          {['get', 'post', 'put', 'delete', 'patch'].map((method) => (
            <div key={method} className="flex items-center space-x-4">
              <Switch
                label={method.toUpperCase()}
                checked={!!formData.methods[method]}
                onChange={(e) => handleMethodChange(method, e.target.checked)}
              />
              {formData.methods[method] && (
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Checkbox
                      key={role}
                      label={role}
                      checked={formData.methods[method].permissions.includes(role)}
                      onChange={() => handlePermissionChange(method, role)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">المرشحات</h3>
          {Object.entries(formData.methods).map(([method, methodData]) => (
            <div key={method} className="space-y-2">
              <h4 className="font-medium">{method.toUpperCase()}</h4>
              {['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'like', 'ilike', 'is', 'in'].map((filterType) => (
                <div key={filterType} className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{filterType}:</span>
                  {columns.filter(c => c !== '*').map((column) => (
                    <Checkbox
                      key={column}
                      label={column}
                      checked={methodData.filters[filterType]?.includes(column)}
                      onChange={() => handleFilterChange(method, filterType, column)}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <Textarea
          name="comment"
          label="تعليق"
          value={formData.comment}
          onChange={handleInputChange}
        />

        <div className="flex items-center space-x-4">
          <Switch
            label="فردي"
            checked={formData.single}
            onChange={(e) => handleInputChange({ target: { name: 'single', type: 'checkbox', checked: e.target.checked } })}
          />
          <Switch
            label="سجل"
            checked={formData.log}
            onChange={(e) => handleInputChange({ target: { name: 'log', type: 'checkbox', checked: e.target.checked } })}
          />
          <Switch
            label="نشط"
            checked={formData.is_active}
            onChange={(e) => handleInputChange({ target: { name: 'is_active', type: 'checkbox', checked: e.target.checked } })}
          />
          <Switch
            label="فاحص"
            checked={formData.checker}
            onChange={(e) => handleInputChange({ target: { name: 'checker', type: 'checkbox', checked: e.target.checked } })}
          />
        </div>

        <Button type="submit" className="mt-4">إنشاء نقطة النهاية</Button>
      </form>

      {showResult && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">النتيجة:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </Card>
  );
}