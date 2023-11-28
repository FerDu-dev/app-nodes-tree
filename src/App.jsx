import { useState, useEffect } from 'react'
import { 
  getNodes, 
  getChildNodes, 
  getLocales, 
  createNode, 
  deleteNode, 
  translateChildNode 
} from './api/nodes';
import { Collapse, Card, Button, Form, Modal, Container } from 'react-bootstrap' 
import { PlusCircle, ArrowUp, ArrowDown, Trash } from 'react-bootstrap-icons';
import NodesComponent from './components/NodesComponent';

function App() {
  const [nodes, setNodes] = useState([]);
  const [locales, setLocales] = useState([]);
  const [open, setOpen] = useState([]);
  const [translations, setTranslations] = useState([]); 
  const [childNodes, setChildNodes] = useState([]);
  const [childNodeId, setChildNodeId] = useState(null); 
  const [selectNodeId, setSelectNodeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLocale, setSelectedLocale] = useState(null);

  useEffect(() => {
    
    fetchNodes();
    fetchLocales();
    
  }, []);
  
  useEffect(() => {
    if (childNodes.length) {
      setOpen(nodes.map((node, index) => node.id === childNodes[0].parent));
    } else {
      setOpen(nodes.map(node => false));
    }
  }, [childNodes]);
  
  const fetchNodes = async () => {
    const nodesData = await getNodes();
    setNodes(nodesData);
  };

  const fetchLocales = async () => {
    const localesData = await getLocales();
    setLocales(localesData);
    setSelectedLocale(localesData[0].locale);
  }




  const handleSelect = async (nodeId, index) => {
    if ((selectNodeId !== nodeId) || !selectNodeId)  {
      const childNodesData = await getChildNodes(nodeId);
      setChildNodes(childNodesData.map(childNode => ({...childNode, translation: 'en_US'})));
      setSelectNodeId(nodeId);
      setNodes(nodes.map(node => node.id === nodeId ? {...node, children: childNodesData} : node));
    }  
    
    if (selectNodeId && selectNodeId == nodeId) {
      setSelectNodeId(null);
      setChildNodeId(null);
      console.log('closing')
      setOpen(nodes.map(node => false));
    }
  };

  const handleAddChild = (nodeId) => {
    setSelectedNode(nodeId);
    setShowModal(true);
  };

  const handleDeleteChild = (node) => {  
    setSelectedNode(node);
    setShowModalDelete(true);
  }

  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleLocaleChange = async (event, childId) => {
    const translatedChildNode = await translateChildNode(childId, event.target.value);
  
    if (translatedChildNode.translation.length) setTranslations([...translations.filter(translation => translation.node_id !== childId), translatedChildNode.translation[0]])
    if (!translatedChildNode.translation.length && event.target.value !== 'en_US') alert('There is no translation for this language/ No hay traduccion para este idioma/ Für diese Sprache gibt es keine Übersetzung')
    setChildNodes(childNodes.map(childNode => childNode.id === childId ? {...childNode, translation: translatedChildNode.translation.length? event.target.value : 'en_US'} : childNode))
    if(event.target.value == 'en_US') setTranslations(translations.filter(translation => translation.node_id !== childId))
  };

  
  const handleModalAccept = async () => {
    const data = { parent: selectedNode.id, locales: [selectedLocale] };
    try {
      const newNode = await createNode(data);
    } catch (error) {
      console.error("Error creating node", error);
    }
    setShowModal(false);
    fetchNodes();  
  };

  const handleModalDeleteClose = () => {
    setShowModalDelete(false);
  }

  const handleModalDeleteAccept = async () => {
    try {
      await deleteNode(selectedNode.id);
      fetchNodes();
    } catch (error) {
      if (error.response.status === 400) {
        alert("Can't delete a parent node");
      } else {
        console.error("Error deleting node", error);
      }
    } finally {
      setShowModalDelete(false);
    }
  }

  return (
    <>
    <Container >
      <h1 style={{marginBlock:'1rem'}}>App Nodes Tree</h1>
      <NodesComponent 
        nodes={nodes} 
        open={open} 
        handleSelect={handleSelect} 
        handleAddChild={handleAddChild} 
        translations={translations} 
        handleLocaleChange={handleLocaleChange} 
        locales={locales} 
        handleDeleteChild={handleDeleteChild} 
      />
    </Container>

      <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar ChildNode</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Desea agregar un ChildNode a {selectedNode?.title}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleModalAccept}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={showModalDelete} onHide={handleModalDeleteClose}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar ChildNode</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Desea eliminar este ChildNode de {selectedNode?.title}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalDeleteClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleModalDeleteAccept}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
     
    </>
  )
}

export default App

