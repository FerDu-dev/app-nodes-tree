import React from 'react';
import { Card, Button, Collapse } from 'react-bootstrap';
import { PlusCircle, ArrowUp, ArrowDown, Trash } from 'react-bootstrap-icons';

export const NodesComponent = ({ nodes, open, handleSelect, handleAddChild, translations, handleLocaleChange, locales, handleDeleteChild }) => {
  return (
    nodes.map((node, index) => (
      <Card key={node.id}>
        <Card.Header>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button style={{textDecoration:'none', color:'black'}} variant="link" onClick={() => handleSelect(node.id, index)}>
              {node.title} {open[index] ? <ArrowUp/> : <ArrowDown/>}
            </Button>
            <PlusCircle onClick={(event) => {
              event.stopPropagation(); // Esto evita que el evento de clic se propague al botón padre
              handleAddChild(node );
            }}
              style={{marginTop:'5px', width:'20px', height:'20px', color:'blue', cursor:'pointer'}}
            />
          </div>
        </Card.Header>
        <Collapse in={open[index]}>
        <Card.Body>
            {node.children && node.children.map(child => (
              <ul key={child.id}>
                <li style={{display:'flex', flexDirection:'row',alignItems:'center', gap:'1rem'}}>
                  <p>
                    {
                      translations.filter(translation => translation.node_id === child.id).length? 
                      translations.filter(translation => translation.node_id === child.id)[0].title
                      :child.title
                    }
                  </p>
                  <select className='form-control' value={child.translation} style={{marginBlock:'2rem'}} aria-label="Default select example" onChange={(event) => handleLocaleChange(event, child.id)} >
                    {locales.map(locale => (
                      <option key={locale.locale} value={locale.locale}>{locale.label}</option>
                    ))} 
                  </select>
                  <Trash onClick={() => handleDeleteChild(child)} style={{marginTop:'4px', width:'20px', height:'20px'}}/>
                </li>
              </ul>
            ))}
          </Card.Body>
        </Collapse>
      </Card>
    ))
  );
}

export default NodesComponent;