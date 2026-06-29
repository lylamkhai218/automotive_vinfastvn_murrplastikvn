import cadquery as cq
import os
import sys

def convert_step_to_stl(step_path, stl_path):
    print(f"Loading {step_path}...")
    try:
        # Import the STEP file
        shape = cq.importers.importStep(step_path)
        print("STEP file loaded successfully. Exporting to STL...")
        # Export to STL
        cq.exporters.export(shape, stl_path)
        print(f"Exported successfully to {stl_path}")
        print(f"STL File Size: {os.path.getsize(stl_path)} bytes")
    except Exception as e:
        print(f"Error during conversion: {e}")
        sys.exit(1)

if __name__ == "__main__":
    convert_step_to_stl(
        "R-Tec Liner 550mmEW_EWX 80 - 200N_83693086.stp",
        "R-Tec_Liner_550mm.stl"
    )
