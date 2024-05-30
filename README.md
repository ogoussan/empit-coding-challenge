# Empit Assignment

## Introduction

Welcome to the Empit Assignment. In this repository, you can find a Flask backend and a React app. Your tasks (below) only require you to make changes to the React app. The React app makes API calls to the Flask backend to fetch the needed data. The data consists of continents, countries, and polygons. Continents have countries referenced to them, and countries have polygons referenced to them. The polygons hold coordinates to create their shape on the map component. Some countries have multiple polygons attached to them as the borders of their territories are not all connected (for example, the Philippines consists of multiple islands, which are not one mass). If you have questions or problems please contact Max Ebert (mebert@empit.com).

NOTE: The countries were mapped to continents by ChatGPT, and we do not guarantee that the countries are mapped to the correct continent.

## Tasks

- There seems to be something wrong with the form component. Find the problem and fix the bug.
- When you click on a rendered polygon, a frame opens. Create a plot component within the frame and plot the following function with the ID of the polygon: $`f(x) = x^{id}`$. You can use `plotly.js` or a similar plotting framework to create the plot.
- Once the frame is opened, the user can't close it unless the selected polygons are changed. Implement a way to close the frame without needing to change the selected polygons.
- Add an "All" option in the dropdowns of the form component. When clicked, it should select all options in its dropdown.
- Optional: Style the components for a better user experience.

## Getting started

We assume that you have `python3` and `node` installed on your local machine. The commands in the provided instructions are tailored to Linux machines. If you are on Windows, the commands might differ.

Navigate into the backend directory:

```console
cd backend
```

Create a virtual environment with Python:

```console
python3 -m venv venv
```

Activate the virtual environment:

```console
. venv/bin/activate
```

Install the dependencies from the `requirements.txt`:

```console
pip install -r requirements.txt
```

Start the Flask backend:

```console
flask run
```

Now in a new terminal navigate into the frontend directory:

```console
cd frontend
```

Install the dependencies:

```console
npm install
```

Run the React app:

```console
npm run dev
```

## My Changes

- Sorted continents and countries alphabetically
- Fixed the bug where polygons stay highlighted even when corresponding country or continent is no longer selected
- Added virtualization to `Dropdown` component, so it can handle the large amount of polygons (+4000 polygons)
- Display selected option as tag with a tag limit
- Scroll to zoom in and out
- Map fills entire width and height and form is rendered as overlay
