function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const texts = document.querySelectorAll(".sidebar-text");

  if (sidebar.classList.contains("w-64")) {
    sidebar.classList.remove("w-64");
    sidebar.classList.add("w-20");

    texts.forEach(text => text.classList.add("hidden"));
  } else {
    sidebar.classList.remove("w-20");
    sidebar.classList.add("w-64");

    texts.forEach(text => text.classList.remove("hidden"));
  }
}