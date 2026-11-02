import { useState } from 'react'
export default function ShoppingList() {
    const [newItem, setNewItem] = useState({
        name: '',
        quantity: '',
        purchaseDate: ''
    })
    const [Items, setItems] = useState([])

    function handleChange(event){
        setNewItem((n) => ({...n, [event.target.name]: event.target.value}))
    }
    function handleSubmit(event){
        event.preventDefault()
        // here you could add the item to a list; for now just clear the form
        setItems((prevItems) => [...prevItems, newItem])
    }
    return (
        <div>
            <h1>Shopping List</h1>
            <h2>añadir elementos</h2>
            <div>
                <form onSubmit={handleSubmit}>
                    <p>
                        <label htmlFor='name'>Product:</label>
                    </p>
                    <p>
                        <input id="name" name="name" value={newItem.name} onChange={handleChange} />
                    </p>
                    <p>
                        <label htmlFor='quantity'>Quantity:</label> 
                    </p>
                    <p>
                        <input id="quantity" name="quantity" value={newItem.quantity} onChange={handleChange} />
                    </p>
                    <p>
                        <label htmlFor='purchaseDate'>Purchase Date:</label>
                    </p>
                    <p>
                        <input id="purchaseDate" name="purchaseDate" type="date" value={newItem.purchaseDate} onChange={handleChange} />
                    </p>
                    <button type="submit">Add Item</button>

                </form>
            </div>
            <div>
                {Items.map((item, index) =>
                <div key={index}>
                    <h4>Product: {item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Purchase Date: {item.purchaseDate}</p>
                </div>)}
            </div>
        </div>
         
    )
}