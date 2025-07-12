from build123d import *
from pathlib import Path

stl_filename = Path('filled box 1x1x6-hi nohole_b.stl')
importer = Mesher()
solid = importer.read(stl_filename)[0] # gets first object, generalize for multiple objects
cleaned_solid = solid.clean()
export_step(cleaned_solid, stl_filename.stem + ".step")
