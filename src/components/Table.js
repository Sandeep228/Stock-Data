import React, { useState, useEffect } from "react";
import "../App.css";
function Table() {
  const [data1, setData1] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastClose, setLastClose] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const url =
    "https://f68370a9-1a80-4b78-b83c-8cb61539ecd6.mock.pstmn.io/api/v1/get_market_data";

  useEffect(() => {
    setLoading(true);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData1(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data1.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageData = data1.slice(startIndex, endIndex);
      if (pageData.length > 0) {
        setLastClose(pageData[0].close);
      }
    }
  }, [currentPage, data1]);

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  function getCloseColor(current, previous) {
    if (current > previous) {
      return "green";
    } else if (current < previous) {
      return "red";
    }
    return "black";
  }

  function getOpenColor(current, previous) {
    if (current === previous) {
      return "black";
    } else if (current > previous) {
      return "green";
    } else if (current < previous) {
      return "red";
    }
  }
  return (
    <div>
      {loading ? (
        <div>Loading data...</div>
      ) : (
        <div className="box">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Open</th>
                  <th>Close</th>
                </tr>
              </thead>
              <tbody>
                {data1.map((item, index) => {
                  if (
                    index >= (currentPage - 1) * itemsPerPage &&
                    index < currentPage * itemsPerPage
                  ) {
                    const previousItem =
                      index === 0 ? null : data1[index - 1].close;
                    const openColor =
                      index === 0 || lastClose === null
                        ? "black"
                        : getOpenColor(item.open, previousItem);
                    const closeColor =
                      item.close !== item.open
                        ? getCloseColor(item.close, item.open)
                        : "black";
                    return (
                      <tr key={item.date}>
                        <td>{formatDate(item.date)}</td>
                        <td style={{ color: openColor }}>{item.open}</td>
                        <td style={{ color: closeColor }}>{item.close}</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
          <div className="btn">
            <button
              style={{
                marginRight: "13px",
                fontSize: "16px",
                padding: "10px 20px",
              }}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              style={{
                fontSize: "16px",
                padding: "10px 20px",
              }}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= data1.length}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Table;
