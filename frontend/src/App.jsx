import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [inventario, setInventario] = useState([])

  useEffect(() => {
    // Aquí React cruza el puente para pedirle los datos a tu servidor Node
    fetch('http://localhost:3001/api/inventario')
      .then(res => res.json())
      .then(data => setInventario(data))
      .catch(err => console.error("Error conectando al servidor:", err))
  }, [])

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="logo">PHAZEER</h1>
        <p className="subtitle">Health Care • Management System</p>
      </header>
      
      <main className="main-content">
        <div className="panel">
          <h2 className="panel-title">Inventario General • Tiempo Real</h2>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Lote</th>
                <th>Stock</th>
                <th>Caducidad</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item, index) => (
                <tr key={index}>
                  <td>{item.sku}</td>
                  <td>{item.nombre}</td>
                  <td>{item.numero_lote}</td>
                  <td className="stock-cell">{item.cantidad_stock} unds.</td>
                  <td>{new Date(item.fecha_caducidad).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default App