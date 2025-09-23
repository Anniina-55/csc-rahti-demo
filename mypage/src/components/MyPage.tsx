import { useState } from "react";

interface Course {
  id: number;
  name: string;
  credits: number;
}

interface MyPageCard {
  title: string;
  description: string;
  features: string[];
}

const myPageContents: MyPageCard[] = [
  {
    title: "Welcome card",
    description: "This card is visible to everyone",
    features: ["This is just demo", "There's some hidden cards", "Login to reveal them"],
  },
  {
    title: "Learning outcome",
    description: "With this assignment I have practised:",
    features: ["Containerization", "React framework", "Python and Flask", ],
  },
];

const inputStyle= {
    borderRadius: "10px",
    padding: "8px",
    border: "1px solid #c530be",
    cursor: "pointer",
    margin: "15px 25px 0 0"
}

export default function MyPage() {
  // Login state
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  // Courses state (simulated API fetch)
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Fruit list (CRUD example)
  const [fruits, setFruits] = useState<string[]>(["Apple", "Banana"]);
  const [newFruit, setNewFruit] = useState("");

  const login = () => {
    if (password === "1234") setLoggedIn(true);
    else alert("Wrong password!");
  };

  const fetchCourses = () => {
    setLoadingCourses(true);
    // Simulate backend fetch
    fetch("/api/courses")
        .then(res => res.json())
        .then(data => {
            setCourses(data);
            setLoadingCourses(false);
        })
        .catch(err => {
            console.error(err)
            setLoadingCourses(false)
        })
  };

  const addFruit = () => {
    if (newFruit.trim() === "") return;
     const formattedFruit = newFruit.charAt(0).toUpperCase() + newFruit.slice(1);
    setFruits([...fruits, formattedFruit]);
    setNewFruit("");
  };
  // go through whole list and return updated state
  const removeFruit = (name: string) => {
    setFruits(fruits.filter(fruit => fruit !== name));
  };

  return (
    <div className="content">
      {/* Static cards */}
      {myPageContents.map((card, index) => (
        <div key={index} className="card">
          <h2>{card.title}</h2>
          <p>{card.description}</p>
          <ul style={{ padding: "15px" }}>
            {card.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Login card */}
      {!loggedIn && (
        <div className="card">
          <h2>Login to see more content</h2>
          <input style={inputStyle}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p style={{fontSize: "14px", fontStyle: "italic", marginLeft: "5px"}}>maybe try '1234'</p>
          <button className="button" onClick={login}>Login</button>
        </div>
      )}

      {/* Courses card (fetch from backend) */}
      {loggedIn && (
        <div className="card">
          <h2>My courses</h2>
          <button className="small-button" onClick={fetchCourses}>
            {loadingCourses ? "Loading..." : "Fetch courses"}
          </button>
          {courses.length > 0 && (
            <ul className="cardList">
              {courses.map((course) => (
                <li key={course.id}>
                  {course.name} ({course.credits} credits)
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Fruits card (CRUD example) */}
      {loggedIn && (
        <div className="card">
          <h2>Fruit list </h2>
          <ul className="cardList">
            {fruits.map((fruit) => (
              <li key={fruit}>
                    {fruit}
                <button
                  className="small-button"
                  onClick={() => removeFruit(fruit)}
                >
                  Remove
                </button>
                
              </li>
            ))}
          </ul>
          <input style={inputStyle}
            type="text"
            placeholder="Add a fruit"
            value={newFruit}
            onChange={(e) => setNewFruit(e.target.value)}
          />
          <button className="small-button" onClick={addFruit}>
            Add fruit
          </button>
          <p style={{marginTop: "10px", fontSize: "0.8rem"}}>*Just useState demo, no database for fruits</p>
        </div>
      )}
    </div>
  );
}

