import React, { useEffect, useState } from "react";
import { setConstraint } from "../constraints";
import Navbar from "../Components/Navbar";
import "../css/feed.css";
import "../css/item_card.css";
import Axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import SearchBar from "./SearchBar";

export default function Feed() {
  // Fetch user information from localStorage
  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [items, setItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [error, setError] = useState(null); // Added error state

const ReadMore = ({ children }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => setIsReadMore(!isReadMore);

  const text = children;

  // Define the character limit (you can adjust this value)
  const charLimit = 20;

  // Only show the "read more" option if the text exceeds the character limit
  if (text.length <= charLimit) {
    return <span>{text}</span>; // No need to toggle if the text is short
  }

  return (
    <span>
      {isReadMore ? text.slice(0, text.slice(0, charLimit).lastIndexOf(" ")) : text}{" "}
      {/* Ensures slicing at the nearest word boundary */}
      <span
        onClick={toggleReadMore}
        className="read-or-hide"
        style={{ cursor: "pointer", color: "grey" }}
      >
        {isReadMore ? "..." : ""}
      </span>
    </span>
  );
};

  // Fetch lost and found items
  useEffect(() => {
    setConstraint(true);

    const fetchItems = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/getitem");
        if (!response.data || !response.data.postitems) {
          throw new Error("Invalid response structure");
        }

        const data = response.data.postitems.reverse(); // Reverse data to show latest items first

        const lostItems = [];
        const foundItemsList = [];

        // Filter and categorize items into Lost and Found, considering the status
        data.forEach((item) => {
          if (item.status === true) {
            // Only consider items with status true
            const created_date = new Date(item.createdAt);
            const createdAt = `${created_date.getDate()}/${
              created_date.getMonth() + 1
            }/${created_date.getFullYear()} ${created_date.getHours()}:${created_date.getMinutes()}`;

            const userIsOwner = item.createdBy === user_info._id;
            // Check if itemPictures array exists and has at least one item
            const imageSrc =
              item.itemPictures && item.itemPictures.length > 0
                ? `http://localhost:5000/${item.itemPictures[0].img}`
                : "/default-img.png"; // Provide a default image

            const card = (
              <Col key={item._id} md={3} xs={12} style={{ marginTop: "5%"}}>
                <Link
                  to={`/item/${item.name}?cid=${item._id}&type=${item.type}`}
                  style={{ textDecoration: "none" }} // Remove default underline from links
                >
                  <Card
                    bsPrefix="item-card"
                    style={{
                      height:"600px",
                      width:"350px",
                      cursor: "pointer",
                      boxShadow: "1px 1px 5px black",
                      padding: "10px",
                      marginLeft: "50px",
                      // marginBottom: "30px",
                      backgroundColor: "#0c151d",
                      borderBottom: "5px solid #ff8b4d",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={imageSrc}
                      style={{
                        padding: "5px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    />
                    <Card.Body bsPrefix="card-body">
                      <Card.Title
                        style={{
                          fontFamily: "Concert One, sans-serif",
                          fontWeight: "1.5rem",
                          fontSize: "1.5rem",
                          textTransform: "uppercase",
                          textDecoration: "underline",
                          textShadow: "1px 1px 2px black",
                          marginBottom: "20px",
                        }}
                      >
                        Item: <ReadMore>{item.name}</ReadMore>
                      </Card.Title>
                      {item.description && (
                        <Card.Text
                          style={{
                            fontFamily: "DynaPuff",
                            fontWeight: "400",
                            textShadow: "1px 1px 2px black",
                            color: "rgb(149, 149, 149)",
                            letterSpacing: "0.75px",
                            marginBottom: "5px",
                          }}
                        >
                          Description: <ReadMore>{item.description}</ReadMore>
                        </Card.Text>
                      )}
                      <Card.Text
                        style={{
                          fontFamily: "DynaPuff, system-ui",
                          fontWeight: "200",
                          fontSize: "1.05rem",
                          textShadow: "1px 1px 2px black",
                          color: "rgb(149, 149, 149)",
                          letterSpacing: "0.85px",
                          marginBottom: "10px",
                        }}
                      >
                        Created at: {createdAt}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );

            // Categorize items into Lost and Found
            if (item.type === "Lost") {
              lostItems.push(card);
            } else if (item.type === "Found") {
              foundItemsList.push(card);
            }
          }
        });

        setItems(lostItems); // Set lost items with status true
        setFoundItems(foundItemsList); // Set found items with status true
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to load items. Please try again later.");
      }
    };

    fetchItems();
  }, [user_info._id]);

  return (
    <div>
      <Navbar />
      <span
        style={{
          fontFamily: "Concert One, sans-serif",
          marginLeft: "5px",
          textTransform: "uppercase",
          margin: "25px",
          fontSize: "45px",
          borderBottom: "5px solid #ff8b4d",
        }}
      >
        Welcome {user_info.firstname} {user_info.lastname}!
      </span>

      {error && (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      )}
      <center>
        <SearchBar />
      </center>
      <Container fluid>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Concert One, sans-serif",
            marginLeft: "5px",
            textTransform: "uppercase",
            fontSize: "35px",
            fontWeight: "600",
          }}
        >
          Lost items:
        </h2>
        <div className="title-border"></div>
        <Row>{items}</Row>
      </Container>

      {foundItems.length > 0 && (
        <Container fluid>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Concert One, sans-serif",
              marginTop:"25px",
              marginLeft: "5px",
              textTransform: "uppercase",
              fontSize: "35px",
              fontWeight: "600",
            }}
          >
            Found items:
          </h2>
          <div className="title-border"></div>
          <Row>{foundItems}</Row>
        </Container>
      )}
    </div>
  );
}
