export default async function handler(req, res) {
  const { postcode, houseNumber } = req.body;
  const apiKey = process.env.GETADDRESS_API_KEY;
  const url = `https://api.getaddress.io/find/${postcode}?api-key=${apiKey}&expand=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const match = data.addresses.find(addr =>
      addr.building_number === houseNumber || addr.building_name === houseNumber
    );

    if (match) {
      res.status(200).json({
        success: true,
        address: match.formatted_address.join(', ')
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Address not found for that house number.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving address.'
    });
  }
}
