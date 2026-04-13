import { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Card, Typography, Select, Space, 
  Divider, Row, Col, Alert, Tag, Modal 
} from 'antd';
import { 
  PlusOutlined, SaveOutlined, DeleteOutlined, CopyOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Генерация тестовых данных
const generateTestData = () => {
  const data = {};
  for (let i = 1; i <= 20; i++) {
    const key = `variableName${i}`;
    if (i % 3 === 0) {
      data[key] = Math.floor(Math.random() * 1000);
    } else if (i % 3 === 1) {
      data[key] = `string_value_${i}`;
    } else {
      data[key] = Math.random() * 100;
    }
  }
  return data;
};

const inputData = generateTestData();

// Операции
const COMPARISON_OPS = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '==', label: '==' },
  { value: '!=', label: '!=' },
];

const LOGICAL_OPS = [
  { value: 'AND', label: 'И' },
  { value: 'OR', label: 'ИЛИ' },
];

// Компонент для узла условия
const ConditionNode = ({ 
  node, 
  nodeId, 
  onUpdate, 
  onDelete, 
  depth = 0 
}) => {
  const isLeaf = node.type === 'leaf';

  const handleVariableChange = (value) => {
    onUpdate(nodeId, { ...node, variable: value });
  };

  const handleOperatorChange = (value) => {
    onUpdate(nodeId, { ...node, operator: value });
  };

  const handleValueTypeChange = (value) => {
    let newValue = node.value;
    if (value === 'number') {
      newValue = parseFloat(node.value) || 0;
    } else if (value === 'variable') {
      newValue = '';
    }
    onUpdate(nodeId, { ...node, valueType: value, value: newValue });
  };

  const handleValueChange = (value) => {
    onUpdate(nodeId, { ...node, value: value });
  };

  const handleLogicalOpChange = (value) => {
    onUpdate(nodeId, { ...node, operator: value });
  };

  const renderLeaf = () => (
    <Space wrap size="small" style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
      <Select
        value={node.variable}
        onChange={handleVariableChange}
        style={{ width: 150 }}
        placeholder="Переменная"
        size="small"
      >
        {Object.keys(inputData).map(key => (
          <Option key={key} value={key}>{key}</Option>
        ))}
      </Select>
      
      <Select
        value={node.operator}
        onChange={handleOperatorChange}
        style={{ width: 80 }}
        size="small"
      >
        {COMPARISON_OPS.map(op => (
          <Option key={op.value} value={op.value}>{op.label}</Option>
        ))}
      </Select>
      
      <Select
        value={node.valueType}
        onChange={handleValueTypeChange}
        style={{ width: 100 }}
        size="small"
        placeholder="Тип значения"
      >
        <Option value="number">Число</Option>
        <Option value="string">Строка</Option>
        <Option value="variable">Переменная</Option>
      </Select>
      
      {node.valueType === 'variable' ? (
        <Select
          value={node.value}
          onChange={handleValueChange}
          style={{ width: 150 }}
          placeholder="Выберите переменную"
          size="small"
          allowClear
        >
          {Object.keys(inputData).map(key => (
            <Option key={key} value={key}>{key}</Option>
          ))}
        </Select>
      ) : node.valueType === 'string' ? (
        <Input
          value={node.value}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Введите строку"
          style={{ width: 150 }}
          size="small"
        />
      ) : (
        <Input
          value={node.value}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Введите число"
          style={{ width: 150 }}
          size="small"
          type="number"
        />
      )}
      
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => onDelete(nodeId)}
        size="small"
      />
    </Space>
  );

  const renderLogical = () => (
    <div style={{ background: '#e6f7ff', padding: '8px', borderRadius: '4px' }}>
      <Space wrap size="small" style={{ marginBottom: '8px' }}>
        <Select
          value={node.operator}
          onChange={handleLogicalOpChange}
          style={{ width: 100 }}
          size="small"
        >
          {LOGICAL_OPS.map(op => (
            <Option key={op.value} value={op.value}>{op.label}</Option>
          ))}
        </Select>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(nodeId)}
          size="small"
        />
      </Space>
      <Row gutter={[8, 8]}>
        <Col span={11}>
          <Text strong>Левое условие:</Text>
          <ConditionNode
            node={node.left}
            nodeId={`${nodeId}.left`}
            onUpdate={onUpdate}
            onDelete={onDelete}
            depth={depth + 1}
          />
        </Col>
        <Col span={2} style={{ textAlign: 'center', paddingTop: '20px' }}>
          <Tag color="blue">{node.operator}</Tag>
        </Col>
        <Col span={11}>
          <Text strong>Правое условие:</Text>
          <ConditionNode
            node={node.right}
            nodeId={`${nodeId}.right`}
            onUpdate={onUpdate}
            onDelete={onDelete}
            depth={depth + 1}
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <div style={{ marginBottom: '8px' }}>
      {isLeaf ? renderLeaf() : renderLogical()}
    </div>
  );
};

const FormPage = () => {
  const [conditionTree, setConditionTree] = useState({
    type: 'leaf',
    variable: '',
    operator: '==',
    value: '',
    valueType: 'number'
  });

  const [jsonOutput, setJsonOutput] = useState('');

  useEffect(() => {
    setJsonOutput(JSON.stringify(conditionTree, null, 2));
  }, [conditionTree]);

  const updateNode = (nodeId, newNode) => {
    const updateInTree = (node, currentId) => {
      if (currentId === nodeId) {
        return newNode;
      }
      
      if (node.left) {
        const updatedLeft = updateInTree(node.left, `${currentId}.left`);
        if (updatedLeft !== node.left) {
          return { ...node, left: updatedLeft };
        }
      }
      
      if (node.right) {
        const updatedRight = updateInTree(node.right, `${currentId}.right`);
        if (updatedRight !== node.right) {
          return { ...node, right: updatedRight };
        }
      }
      
      return node;
    };
    
    setConditionTree(prev => updateInTree(prev, 'root'));
  };

  const deleteNode = (nodeId) => {
    Modal.confirm({
      title: 'Удалить узел?',
      content: 'Вы уверены, что хотите удалить этот узел условия?',
      onOk: () => {
        if (nodeId === 'root') {
          setConditionTree({
            type: 'leaf',
            variable: '',
            operator: '==',
            value: '',
            valueType: 'number'
          });
          return;
        }

        const deleteFromTree = (node, currentId) => {
          if (nodeId.startsWith(`${currentId}.left`)) {
            if (nodeId === `${currentId}.left`) {
              return { ...node, left: null };
            }
            if (node.left) {
              const updatedLeft = deleteFromTree(node.left, `${currentId}.left`);
              return { ...node, left: updatedLeft };
            }
          }
          
          if (nodeId.startsWith(`${currentId}.right`)) {
            if (nodeId === `${currentId}.right`) {
              return { ...node, right: null };
            }
            if (node.right) {
              const updatedRight = deleteFromTree(node.right, `${currentId}.right`);
              return { ...node, right: updatedRight };
            }
          }
          
          return node;
        };

        setConditionTree(prev => {
          const result = deleteFromTree(prev, 'root');
          if ((!result.left && result.right) || (result.left && !result.right)) {
            return result.left || result.right || {
              type: 'leaf',
              variable: '',
              operator: '==',
              value: '',
              valueType: 'number'
            };
          }
          return result;
        });
      }
    });
  };

  const addLogicalNode = () => {
    setConditionTree({
      type: 'logical',
      operator: 'AND',
      left: conditionTree,
      right: {
        type: 'leaf',
        variable: '',
        operator: '==',
        value: '',
        valueType: 'number'
      }
    });
  };

  const convertToLogical = () => {
    if (conditionTree.type === 'leaf') {
      setConditionTree({
        type: 'logical',
        operator: 'AND',
        left: conditionTree,
        right: {
          type: 'leaf',
          variable: '',
          operator: '==',
          value: '',
          valueType: 'number'
        }
      });
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert('JSON скопирован в буфер обмена!');
  };

  const resetForm = () => {
    setConditionTree({
      type: 'leaf',
      variable: '',
      operator: '==',
      value: '',
      valueType: 'number'
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>Конструктор условий</Title>
        <Text type="secondary">
          Создавайте сложные условия с помощью логических операторов и сравнений
        </Text>
        
        <Divider />
        
        <Alert
          message="Входные данные"
          description={
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              <pre style={{ margin: 0, fontSize: '12px' }}>
                {JSON.stringify(inputData, null, 2)}
              </pre>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />

        <Space style={{ marginBottom: '16px' }}>
          {conditionTree.type === 'leaf' && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={convertToLogical}
            >
              Добавить логический оператор
            </Button>
          )}
          <Button 
            icon={<PlusOutlined />} 
            onClick={addLogicalNode}
            disabled={conditionTree.type === 'logical'}
          >
            Создать новое логическое условие
          </Button>
          <Button 
            icon={<SaveOutlined />} 
            onClick={() => alert('Условия сохранены! Проверьте JSON ниже.')}
            type="default"
          >
            Сохранить
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            onClick={resetForm}
            danger
          >
            Сбросить
          </Button>
        </Space>

        <Divider orientation="left">Дерево условий</Divider>
        
        <ConditionNode
          node={conditionTree}
          nodeId="root"
          onUpdate={updateNode}
          onDelete={deleteNode}
        />
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0 }}>JSON вывод</Title>
          <Button 
            icon={<CopyOutlined />} 
            onClick={copyJson}
            size="small"
          >
            Копировать JSON
          </Button>
        </div>
        <div 
          style={{ 
            background: '#1e1e1e', 
            color: '#d4d4d4', 
            padding: '16px', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '13px',
            maxHeight: '400px',
            overflow: 'auto'
          }}
        >
          <pre style={{ margin: 0 }}>{jsonOutput}</pre>
        </div>
      </Card>
    </div>
  );
};

export default FormPage;
