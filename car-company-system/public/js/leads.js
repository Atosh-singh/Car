async function updateStatus(id, status) {
  try {
    await fetch(`/crm/lead/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    location.reload();

  } catch (err) {
    console.error(err);
    alert("Status update failed");
  }
}