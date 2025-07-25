import React from "react";
import "../App.css";

const CardDetail = () => {
  return (
    <div className="card-detail-overlay">
      <div className="card-detail-modal">
        <button className="close-button">×</button>

        <h2 className="card-title">Design new landing page</h2>
        <p className="card-subtitle">
          in list <strong>To Do</strong>
        </p>

        <div className="card-content">
          <div className="card-main">
            <section className="card-section">
              <h3>Description</h3>
              <textarea
                className="card-textarea"
                defaultValue="This task involves creating a new landing page design that will improve user conversion rates and better showcase our product features."
              />
            </section>

            <section className="card-section">
              <h3>Checklist</h3>
              <ul className="checklist">
                <li>
                  <input type="checkbox" defaultChecked /> Research competitor
                  landing pages
                </li>
                <li>
                  <input type="checkbox" defaultChecked /> Create wireframes
                </li>
                <li>
                  <input type="checkbox" /> Design high-fidelity mockups
                </li>
                <li>
                  <input type="checkbox" /> Get stakeholder approval
                </li>
              </ul>
              <button className="add-item-button">Add an item</button>
            </section>

            <section className="card-section">
              <h3>Activity</h3>
              <div className="activity-item">
                <span className="avatar">👤</span>
                <div>
                  <strong>Sarah Chen</strong> • 2 hours ago
                  <p>
                    I've completed the wireframes and shared them in the design
                    folder. Ready for the next phase!
                  </p>
                </div>
              </div>
              <textarea
                className="comment-box"
                placeholder="Write a comment..."
              />
            </section>
          </div>

          <div className="card-sidebar">
            <section className="card-section">
              <h4>Labels</h4>
              <div className="tag-list">
                <span className="tag">Design</span>
                <span className="tag">High Priority</span>
              </div>
              <button className="link-button">Add labels</button>
            </section>

            <section className="card-section">
              <h4>Members</h4>
              <div className="member-list">👤 👥</div>
              <button className="link-button">Add members</button>
            </section>

            <section className="card-section">
              <h4>Due Date</h4>
              <button className="date-button">📅 Set due date</button>
            </section>

            <section className="card-section">
              <h4>Attachments</h4>
              <button className="attach-button">📎 Attach file</button>
            </section>

            <section className="card-section">
              <h4>Actions</h4>
              <button className="action-button">Move card</button>
              <button className="action-button">Copy card</button>
              <button className="action-button delete">Delete card</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
