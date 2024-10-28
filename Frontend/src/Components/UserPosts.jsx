import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import Navbar from "./Navbar";

// UserPosts Component
import { Card, Col, Container, Row, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserPosts() {
  const { userId } = useParams();
  const [items, setItems] = useState([]);
  const [info, setInfo] = useState("");

  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };

    return (
      <span
        className="text"
        style={{
          color: "rgb(149, 149, 149)",
          letterSpacing: "0.1px",
          fontFamily: "DynaPuff",
          fontWeight: "400",
          textTransform: "capitalize",
        }}
      >
        {isReadMore ? text.slice(0, 15) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? "...." : " show less"}
        </span>
      </span>
    );
  };

  const fetchItems = async () => {
    try {
      const response = await Axios.get(`http://localhost:5000/user/${userId}`);
      setInfo(response.message);

      const data = response.data;
      if (data) {
        const itemList = data.reverse().map((item) => {
          const createdDate = new Date(item.createdAt);
          const createdAt =
            `${createdDate.getDate()}/${
              createdDate.getMonth() + 1
            }/${createdDate.getFullYear()} ` +
            `${createdDate.getHours()}:${createdDate.getMinutes()}`;

          const imageSrc =
            item.itemPictures && item.itemPictures.length > 0
              ? `http://localhost:5000/${item.itemPictures[0].img}`
              : "/default-img.png";

          return (
            <Col key={item._id} style={{ marginTop: "2%" }} md={3}>
              <Link to={`/item/${item.name}?cid=${item._id}&type=${item.type}`}>
                <Card
                  bsPrefix="item-card"
                  style={{
                    cursor: "pointer",
                    boxShadow: "1px 1px 5px black",
                    padding: "10px",
                    marginLeft: "30px",
                    marginBottom: "30px",
                    backgroundColor: "#0c151d",
                    borderBottom: "5px solid #ff8b4d",
                    height: "500px",
                    width: "350px",
                    maxHeight: "650px",
                    maxWidth: "650px",
                  }}
                >
                  <Card.Img
                    variant="top"
                    style={{
                      padding: "5px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                    src={imageSrc}
                  />
                  <Card.Body bsPrefix="card-body">
                    <span
                      variant={item.status ? "success" : "secondary"}
                      style={{
                        marginTop: "15px",
                        marginBottom: "15px",
                        letterSpacing: "1px",
                        fontSize: "0.95rem",
                        backgroundColor: "#ff8b4d",
                        textShadow: "0px 0px 0.5px black",
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        borderRadius: "15px",
                        color: "#0c151d",
                        boxShadow: "2px 2px 2px black",
                      }}
                      className="badge"
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                    <Card.Title
                      style={{
                        fontFamily: "Concert One, sans-serif",
                        fontWeight: "1.5rem",
                        fontSize: "1.15rem",
                        textTransform: "uppercase",
                        textDecoration: "underline",
                        textShadow: "1px 1px 2px black",
                        marginBottom: "15px",
                      }}
                    >
                      Item : {item.name}
                    </Card.Title>
                    {item.description && (
                      <Card.Text
                        style={{
                          fontFamily: "DynaPuff",
                          fontWeight: "400",
                          textShadow: "1px 1px 2px black",
                          color: "rgb(149, 149, 149)",
                          letterSpacing: "0.75px",
                          marginBottom: "15px",
                          fontSize: "0.95rem",
                        }}
                      >
                        Description:{" "}
                        <ReadMore
                          style={{
                            fontFamily: "DynaPuff",
                            fontWeight: "400",
                            textShadow: "1px 1px 2px black",
                            color: "rgb(149, 149, 149)",
                            letterSpacing: "0.75px",
                            marginBottom: "15px",
                            fontSize: "0.95rem",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.description}
                        </ReadMore>
                      </Card.Text>
                    )}
                    <Card.Text
                      style={{
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        textShadow: "1px 1px 2px black",
                        color: "rgb(149, 149, 149)",
                        letterSpacing: "0.75px",
                        marginBottom: "15px",
                        fontSize: "0.95rem",
                      }}
                    >
                      Type : {item.type}
                    </Card.Text>
                    <Card.Text
                      style={{
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        textShadow: "1px 1px 2px black",
                        color: "rgb(149, 149, 149)",
                        letterSpacing: "0.75px",
                        marginBottom: "15px",
                        fontSize: "0.95rem",
                      }}
                    >
                      Created at : {createdAt}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          );
        });

        setItems(itemList);
      } else {
        setInfo(response.message);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [info]);

  return (
    <div>
      <Navbar />
      <div className="listing-title">
        <h2
          style={{
            textTransform: "uppercase",
            textAlign: "center",
            fontFamily: "Concert One, sans-serif",
            fontWeight: "600",
          }}
        >
          User Posts
        </h2>
        <div className="title-border"></div>
        <div
          style={{
            color: "red",
            fontFamily: "DynaPuff",
            fontWeight: "400",
            marginTop: "20px",
            fontSize: "1.25rem",
            textShadow: "0.5px 0.5px 2px black",
          }}
        >
          {info}
        </div>
      </div>
      <Container fluid>
        <Row>{items}</Row>
      </Container>
    </div>
  );
}