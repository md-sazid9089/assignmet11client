import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Define styles with Slate & Clay theme
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f8fafc',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#0f172a', // Deep slate
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#b35a44', // Clay color
    fontSize: 12,
    textAlign: 'center',
  },
  ticketContainer: {
    border: '2 solid #e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  ticketHeader: {
    backgroundColor: '#b35a44', // Clay background
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingId: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketType: {
    color: '#ffffff',
    fontSize: 12,
    backgroundColor: '#0f172a',
    padding: '5 10',
    borderRadius: 4,
  },
  ticketBody: {
    padding: 20,
  },
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 8,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  arrow: {
    fontSize: 20,
    color: '#b35a44',
    marginHorizontal: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  detailItem: {
    width: '50%',
    marginBottom: 15,
    paddingRight: 10,
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  priceSection: {
    backgroundColor: '#0f172a',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  priceLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 5,
  },
  priceValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1 solid #e2e8f0',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 5,
  },
  qrSection: {
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  qrText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    color: '#f1f5f9',
    fontWeight: 'bold',
    zIndex: -1,
  },
});

const TicketPDF = ({ booking }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate seat number (dummy for now)
  const generateSeatNumber = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const numbers = Math.floor(Math.random() * 30) + 1;
    const row = rows[Math.floor(Math.random() * rows.length)];
    return `${row}${numbers}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>URAAN</Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>URAAN TRAVEL</Text>
          <Text style={styles.headerSubtitle}>Your Journey, Our Priority</Text>
        </View>

        {/* Ticket Container */}
        <View style={styles.ticketContainer}>
          {/* Ticket Header */}
          <View style={styles.ticketHeader}>
            <Text style={styles.bookingId}>
              {booking.bookingId || `UR-${booking._id?.slice(-6).toUpperCase()}`}
            </Text>
            <Text style={styles.ticketType}>
              {booking.ticketId?.transportType?.toUpperCase() || 'TICKET'}
            </Text>
          </View>

          {/* Ticket Body */}
          <View style={styles.ticketBody}>
            {/* Route Section */}
            <View style={styles.routeSection}>
              <Text style={styles.routeText}>
                {booking.ticketId?.from || booking.ticketDetails?.fromLocation || 'N/A'}
              </Text>
              <Text style={styles.arrow}>✈</Text>
              <Text style={styles.routeText}>
                {booking.ticketId?.to || booking.ticketDetails?.toLocation || 'N/A'}
              </Text>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Passenger Name</Text>
                <Text style={styles.detailValue}>{booking.userName}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{booking.userEmail}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Departure Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(booking.ticketId?.departureDate || booking.ticketDetails?.departureDateTime)}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Departure Time</Text>
                <Text style={styles.detailValue}>
                  {booking.ticketId?.departureTime || formatTime(booking.ticketDetails?.departureDateTime) || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Seat Number</Text>
                <Text style={styles.detailValue}>{generateSeatNumber()}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>{booking.quantity || booking.bookingQuantity} Seat(s)</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{booking.status?.toUpperCase()}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Transport Type</Text>
                <Text style={styles.detailValue}>
                  {booking.ticketId?.transportType?.toUpperCase() || 'BUS'}
                </Text>
              </View>
            </View>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Total Amount Paid</Text>
              <Text style={styles.priceValue}>৳{booking.totalPrice?.toLocaleString()}</Text>
            </View>

            {/* QR Code Section */}
            <View style={styles.qrSection}>
              <Text style={styles.qrText}>
                Scan this QR code at the terminal for quick check-in
              </Text>
              <Text style={styles.qrText}>
                Booking Reference: {booking.bookingId || booking._id}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Please arrive at the terminal 30 minutes before departure time.
          </Text>
          <Text style={styles.footerText}>
            This is an electronically generated ticket. No signature required.
          </Text>
          <Text style={styles.footerText}>
            Generated on: {new Date().toLocaleDateString('en-US')} at {new Date().toLocaleTimeString('en-US')}
          </Text>
          <Text style={styles.footerText}>
            For support: support@uraan.com | +880 1234-567890
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;