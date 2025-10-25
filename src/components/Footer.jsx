import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About BiblioTech</h3>
          <p>Your digital library management system for borrowing and discovering books.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#catalog">Catalog</a>
            </li>
            <li>
              <a href="#profile">My Profile</a>
            </li>
            <li>
              <a href="#help">Help</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@bibliotech.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 BiblioTech. All rights reserved.</p>
      </div>
    </footer>
  )
}
