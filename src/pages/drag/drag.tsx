/* eslint-disable react/jsx-key */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
// import React from 'react'

// import useDraggableItems from 'react-drag-elements'

// const initialItems = [
//   { id: 0, text: 'One'},
//   { id: 1, text: 'Two' },
//   { id: 2, text: 'Three', color: '#fd4e4e' },
//   { id: 3, text: 'Four', color: '#FFBF00' },
//   { id: 4, text: 'Five', color: '#e66139' },
//   { id: 5, text: 'Six', color: '#3577ef' },
//   { id: 6, text: 'Seven', color: '#ababab' },
//   { id: 7, text: 'Eight', color: '#21C8B7' },
//   { id: 8, text: 'Nine', color: '#FED67D' },
//   { id: 9, text: 'Ten', color: '#013540' },
// ]

//  function App() {
//   const { items, getItemProps } = useDraggableItems({
//     initialItems,
//   })

//   // Fade in demo
//   React.useEffect(() => {
//     document.body.style.opacity = '1'
//   }, [])

//   return (
//     <div className="demo">
//       <h1>Moveable Cards 🕹</h1>
//       <ul>
//         {items.map((item: any) => (
//           <li key={item.id}>
//             <button
//               {...getItemProps(item.id)}
//               style={{ background: item.color }}
//             >
//               <span>{item.text}</span>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }


// export default App







"use client"

import { useRef, useState } from 'react';
import Lucide from '../../components/common/lucide'

export default function Home() {
  const [people, setPeople] = useState([
    { id: 1, name: 'John Doe', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu.', sets: '3x10' },
    { id: 2, name: 'Max Walters', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu.', sets: '3x10' },
    { id: 3, name: 'Adam Smith', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu.', sets: '3x10' },
    { id: 4, name: 'Tom Johnson', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu.', sets: '3x10' },
  ]);

  const dragPerson = useRef<number>(0);
  const draggedOverPerson = useRef<number>(0);

  function handleSort() {
    const peopleClone = [...people];
    const temp = peopleClone[dragPerson.current];
    peopleClone[dragPerson.current] = peopleClone[draggedOverPerson.current];
    peopleClone[draggedOverPerson.current] = temp;
    setPeople(peopleClone);
  }

  return (
    <main className="flex min-h-screen flex-col items-center space-y-4">
      <h1 className="text-xl font-bold mt-4">List</h1>
      {people.map((person, index) => (
        <div className="relative flex space-x-3 border rounded p-2 bg-gray-100"
          draggable
          onDragStart={() => (dragPerson.current = index)}
          onDragEnter={() => (draggedOverPerson.current = index)}
          onDragEnd={handleSort}
          onDragOver={(e) => e.preventDefault()}
        >
          <Lucide icon="Filter" className="w-4 h-4 ml-2" /> {/* Lucide icon before the person's name */}
          <p>{person.name}</p>
        </div>
      ))}
    </main>
  );
}








/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prettier/prettier */
// import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd"
// import React, { useState } from 'react'

// const listItems = [
// 	{
// 		id: "1",
// 		name: "Study Spanish"
// 	},
// 	{
// 		id: "2",
// 		name: "Workout"
// 	},
// 	{
// 		id: "3",
// 		name: "Film Youtube"
// 	},
// 	{
// 		id: "4",
// 		name: "Grocery Shop"
// 	}
// ]

// const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
// 	padding: 10,
// 	margin: `0 50px 15px 50px`,
// 	background: isDragging ? "#4a2975" : "white",
// 	color: isDragging ? "white" : "black",
// 	border: `1px solid black`,
// 	fontSize: `20px`,
// 	borderRadius: `5px`,

// 	...draggableStyle
// })


// function Main() {

//   const [ todo, setTodo ] = useState(listItems)

// 	const onDragEnd = (result: DropResult) => {
// 		const { source, destination } = result
// 		if (!destination) return

// 		const items = Array.from(todo)
// 		const [ newOrder ] = items.splice(source.index, 1)
// 		items.splice(destination.index, 0, newOrder)

// 		setTodo(items)
// 	}
//     return (
//             <div >
// 			<DragDropContext onDragEnd={onDragEnd}>
// 				<Droppable droppableId="todo">
// 					{(provided) => (
// 						<div className="todo" {...provided.droppableProps} ref={provided.innerRef}>
// 							{todo.map(({ id, name }, index) => {
// 								return (
// 									<Draggable key={id} draggableId={id} index={index}>
// 										{(provided, snapshot) => (
// 											<div
// 												ref={provided.innerRef}
// 												{...provided.draggableProps}
// 												{...provided.dragHandleProps}
// 												style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
// 											>
// 												{name}
// 											</div>
// 										)}
// 									</Draggable>
// 								)
// 							})}
// 						</div>
// 					)}
// 				</Droppable>
// 			</DragDropContext>
// 		</div>

//   )
// }

// export default Main