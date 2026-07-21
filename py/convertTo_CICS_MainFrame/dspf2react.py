"""
dspf2react

This script converts DSPF (Display File) definitions into React components. 
It reads DSPF files, extracts information about the display file items, 
and generates corresponding React component code.

The conversion process includes extracting properties such as position, 
type, length, name, and title from DSPF item definitions. 
The extracted information is then used to generate React component code
for input and output fields.

Author: KhangNV19
Date: 2024-1-15
"""
import argparse
import os
import re
import json
import codecs


def get_value(search_result):
    """
    Extracts a value from a search result.

    Args:
    - search_result (str): The search result string.

    Returns:
    - str: Extracted value.
    """
    value = ""
    if search_result.find("=") == -1:
        find_match = re.compile(r"'(.*?)'").search(search_result)
        if find_match:
            value = find_match.group(0)
    elif not search_result.find(")") == -1:
        value = (
            search_result[search_result.find("=") + 1 :]
            .replace("(", "")
            .replace(")", "")
            .split(",")
        )
    elif search_result.find(")") == -1:
        value = search_result[search_result.find("=") + 1 :]
    if value[0] == "'" and value[-1] == "'":
        value = value.removeprefix("'").removesuffix("'")
    return value


def extract_property(current_item):
    """
    Extracts properties (position, type, length, name, title) from DSPF item definitions.

    Args:
    - current_item (str): DSPF item definition string.

    Returns:
    - dict: Dictionary containing extracted properties.
    """
    data = {}
    line = re.sub(r"A\*{0,1}\s{1,2}\d*\s+", "A         ", current_item)
    pattern_case_just_position_and_value = re.compile(r"A\*{0,1}\s+\d+\s{1,2}\d+")
    if pattern_case_just_position_and_value.search(current_item):
        pattern = re.compile(r"\s+\d+\s{1,2}\d+")
        result = pattern.search(line)
        final_result = (
            [
                position
                for position in result.group(0).strip().split(" ")
                if not position == ""
            ]
            if result
            else None
        )
        data["pos"] = final_result

        pattern = re.compile(r"\d+\s{0,3}\'.*\'", re.DOTALL)
        result = pattern.search(line)
        final_result = (
            re.sub(
                r"[\n\r\+\-\']",
                "",
                re.sub("\\d*'", "", re.sub(r"\s*A\*{0,1}\s+", "", result.group(0))),
            )
            if result
            else None
        )
        data["title"] = final_result
    else:
        pattern = re.compile(r"\s+\d+\s{1,2}\d+")
        result = pattern.search(line)
        final_result = (
            [
                position
                for position in result.group(0).strip().split(" ")
                if not position == ""
            ]
            if result
            else None
        )
        data["pos"] = final_result

        pattern = re.compile(r"\s+\d*[BIO\s]\s+\d+\s{1,2}\d+")
        result = pattern.search(line)
        final_result = (
            re.sub(r"\s+\d+\s{1,2}\d+", "", result.group(0)).strip() if result else None
        )
        data["type"] = (
            re.sub(r"[^IOB]", "", str(final_result))
            if not re.sub(r"[^IOB]", "", str(final_result)) == ""
            else None
        )

        pattern = re.compile(r"\s+[0-9]*[A-Z]*\s+\d*[BIO\s]\s+\d+\s{1,2}\d+")
        result = pattern.search(line)
        final_result = (
            re.sub(r"\s+\d*[BIO\s]\s+\d+\s{1,2}\d+", "", result.group(0).strip())
            if result
            else None
        )
        data["length"] = (
            re.sub(r"[^0-9]", "", str(final_result))
            if not re.sub(r"[^0-9]", "", str(final_result)) == ""
            else None
        )

        pattern = re.compile(r"\s+[0-9]*[A-Z]*\s+\d*[BIO\s]\s+\d+\s{1,2}\d+")
        pattern2 = re.compile(r"A\*{0,1}\s+\d*\s+")
        result = pattern.search(line)
        result2 = pattern2.search(line)
        final_result = (
            line[result2.span()[1] if result2 else 0 : result.span()[0]]
            if result
            else None
        )
        data["name"] = final_result

        pattern = re.compile(r"\d+\s{0,3}\'.*\'", re.DOTALL)
        result = pattern.search(line)
        final_result = (
            re.sub(
                r"[\n\r\+\-\']",
                "",
                re.sub("\\d*'", "", re.sub(r"\s*A\*{0,1}\s+", "", result.group(0))),
            )
            if result
            else None
        )
        data["title"] = final_result
    return data


# A DDS comment line: an "A" specification line whose sequence-number/name
# columns start with "*". These carry no field/record data and must never be
# parsed as one (a prior bug let timestamp comments like
# "A*%%TS SD 20070809 151738 ..." be mistaken for a field at row 20070809).
COMMENT_LINE = re.compile(r"^\s*A\*")

# A record-format header line, e.g. "A          R GETNAME" or "A R LIST SFL".
RECORD_HEADER = re.compile(r"^\s*A\s+R\s+(\w+)(.*)$")


def extract_map_items_from_lines(lines):
    """
    Extracts a list of DSPF item properties from an in-memory list of lines
    belonging to a single record format.

    Args:
    - lines (list of str): Lines to parse (comment lines already excluded).

    Returns:
    - list: List of dictionaries containing DSPF item properties.
    """
    map_items = []
    current_item = ""
    new_item = ""
    pattern = re.compile(r"A\*{0,1}\s+.{2,}\s{1}\d+\s+\d+.*")
    for line in lines:
        result = pattern.search(line)
        if result:
            new_item += line
        else:
            current_item += line
        if new_item:
            data = extract_property(current_item)
            map_items.append(data)
            current_item = new_item
            new_item = ""
    data = extract_property(current_item)
    map_items.append(data)
    return map_items


def split_by_record(file_path):
    """
    Splits a DSPF file into blocks per record format (DDS "R" specification).

    Multiple record formats in one physical file usually mean multiple,
    sequentially-displayed screens (e.g. a name prompt, then a result panel).
    The exception is the subfile pattern (a record flagged SFL/SFLCTL): those
    records are always displayed together as one interactive screen, so they
    are kept merged instead of being split apart.

    Args:
    - file_path (str): Path to the DSPF file.

    Returns:
    - list: List of (record_name, lines) tuples. record_name is None when
      the file has no (or only one) record format.
    """
    with codecs.open(file_path, "r", encoding="utf-8") as file:
        raw_lines = file.readlines()

    blocks = []
    current_name = None
    current_lines = []
    has_subfile = False
    for line in raw_lines:
        if COMMENT_LINE.match(line):
            continue
        header = RECORD_HEADER.match(line)
        if header:
            if "SFL" in header.group(2):
                has_subfile = True
            if current_name is not None or current_lines:
                blocks.append((current_name, current_lines))
            current_name = header.group(1)
            current_lines = []
        else:
            current_lines.append(line)
    blocks.append((current_name, current_lines))

    if has_subfile:
        merged_lines = []
        for _, lines in blocks:
            merged_lines.extend(lines)
        return [(None, merged_lines)]

    real_blocks = [(name, lines) for name, lines in blocks if name is not None]
    if not real_blocks:
        return [(None, blocks[0][1] if blocks else [])]
    return real_blocks


def extract_map_items(file_path):
    """
    Reads a DSPF file and extracts a list of DSPF item properties.

    Args:
    - file_path (str): Path to the DSPF file.

    Returns:
    - list: List of dictionaries containing DSPF item properties.
    """
    with codecs.open(file_path, "r", encoding="utf-8") as file:
        raw_lines = [line for line in file if not COMMENT_LINE.match(line)]
    return extract_map_items_from_lines(raw_lines)


def convert_dspf_item(define_data):
    """
    Converts DSPF item properties to React component code.

    Args:
    - define_data (dict): Dictionary containing DSPF item properties.

    Returns:
    - str: Generated React component code.
    """
    try:
        react_code = ""
        tag = "input" if (define_data.get("type") in ["I", "B"]) else "label"
        col = int(define_data["pos"][1])
        row = int(define_data["pos"][0])
        tsx_id = (
            f"id='{define_data['name']}'".lower()
            if ("name" in define_data and define_data["name"])
            else ""
        )
        name = (
            f"name='{define_data['name']}'".lower()
            if ("name" in define_data and define_data["name"])
            else ""
        )
        max_length = (
            f'maxLength={{{int(define_data["length"])}}}'
            if ("length" in define_data and define_data["length"])
            else ""
        )
        # receivedData.{define_data.get('name').lower()
        initial = (
            f'value={{formData.{define_data.get("name").lower()} }}'
            if ("name" in define_data and define_data["name"])
            else ""
        )
        initial_output = (
            f"{{receivedData.{define_data.get('name').lower()} }}"
            if define_data.get("name")
            else (
                f'{define_data["title"]}'
                if ("title" in define_data and define_data["title"])
                else ""
            )
        )

        if tag == "label":
            react_code = f"""
        <GridItem col={{{col}}} row={{{row}}}>
            <label {tsx_id}>
                {initial_output}
            </label>
        </GridItem>
            """
        else:
            on_change_function = ""
            on_keydown_function = ""
            if name:
                on_change_function = "onChange={handleInputChange}"
                on_keydown_function = "onKeyDown={handleSubmit}"
            react_code = f"""
        <GridItem col={{{col}}} row={{{row}}}>
            <Input {max_length} {tsx_id} {name} {initial} {on_change_function} {on_keydown_function}/>
        </GridItem>
            """
        return react_code
    except Exception as ex:
        print(ex)
    return


def get_all_field_name(map_items):
    """
    Extracts and filters input fields from the provided map items.

    Args:
    - map_items (list of dict): List of dictionaries representing map items.

    Returns:
    - list of dict: List of dictionaries representing input fields.
    """
    filtered_list = [
        {"name": item.get("name", ""), "type": "text", "jtype": "String", **item}
        for item in map_items
        if "name" in item
        and item["name"]
        and "type" in item
        and item["type"] in {"I", "B"}
    ]
    unique_names = set()
    unique_list_of_dicts = [
        d
        for d in filtered_list
        if d["name"] not in unique_names and not unique_names.add(d["name"])
    ]
    return unique_list_of_dicts


def get_all_output_field_name(map_items):
    """
    Extracts and filters output fields from the provided map items.

    Args:
    - map_items (list of dict): List of dictionaries representing map items.

    Returns:
    - list of dict: List of dictionaries representing output fields.
    """
    filtered_list = [
        {"name": item.get("name", ""), "type": "text", "jtype": "String", **item}
        for item in map_items
        if "name" in item
        and item["name"]
        and "type" in item
        and item["type"] in {"O", "B"}
    ]
    unique_names = set()
    unique_list_of_dicts = [
        d
        for d in filtered_list
        if d["name"] not in unique_names and not unique_names.add(d["name"])
    ]
    return unique_list_of_dicts


def extract_type_data(map_items, file_name):
    """
    Extracts type data for React components based on DSPF input and output fields.

    Args:
    - map_items (list of dict): List of dictionaries representing map items.
    - file_name (str): Name of the React component.

    Returns:
    - str: React type data for input and output fields.
    """
    input_fields = get_all_field_name(map_items)
    output_fields = get_all_output_field_name(map_items)
    react_type_input = ""
    for item in input_fields:
        react_type_input += f"{item['name'].lower()}: string,\n"
    react_type_output = ""
    for item in output_fields:
        react_type_output += f"{item['name'].lower()}: string,\n"

    react_type_input_initial = react_type_input.replace(
        "string,", (item["title"] if item.get("title") else repr("")) + ","
    )
    react_type_output_initial = ""
    for item in output_fields:
        react_type_output_initial += f"{item['name'].lower()}: { repr(item.get('initial')) if item.get('initial') else repr('')},\n"

    # A screen with no output fields (e.g. a pure input/prompt panel) has
    # nothing to store the response in, so receivedData/setReceivedData must
    # be omitted entirely -- declaring them unused would fail the strict
    # noUnusedLocals build check.
    received_data_state = (
        f"""
    const [receivedData, setReceivedData] = useState<formOutput>(
     {{
        {react_type_output_initial}
    }});"""
        if output_fields
        else ""
    )
    set_received_data_call = (
        "\n        setReceivedData(_state => response.data);" if output_fields else ""
    )

    handle_data = f"""{""}
    const [formData, setFormData] = useState<formInput>(
    {{
        {react_type_input_initial}
    }});{received_data_state}

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {{
    setFormData((state) => {{
        return {{
        ...state,
        [event.target.name]: event.target.value,
        }};
    }});
    }};

    const handleSubmit = async (event: KeyboardEvent<HTMLInputElement>) => {{
    if (event.key === 'Enter') {{
        for (const key in formData) {{
        if (!formData[key as keyof typeof formData]) {{
            return;
        }}
        }}

        {"const response = " if output_fields else ""}await axios.post(
        httpConfig.domain + '/{file_name.capitalize()}',
        formData
        );
{set_received_data_call}
    }}
    }};
    """

    react_type_input = ""
    for item in input_fields:
        react_type_input += f"{item['name'].lower()}: string,\n"
    react_type_output = ""
    for item in output_fields:
        react_type_output += f"{item['name'].lower()}: string,\n"
    # formOutput is only referenced (via useState<formOutput>) when there is
    # at least one output field; an unused type declaration otherwise fails
    # the strict noUnusedLocals build check.
    form_output_type = (
        f"""
    type formOutput = {{
        {react_type_output}
    }}"""
        if output_fields
        else ""
    )
    react_code = f"""
    type formInput = {{
        {react_type_input}
    }}
{form_output_type}
    """
    return react_code + handle_data


def convert_react_items(map_items):
    """
    Converts a list of DSPF items to React components.

    Args:
    - map_items (list): List of dictionaries containing DSPF item properties.

    Returns:
    - list: List of generated React component codes.
    """
    react_items = []
    for map_item in map_items:
        if "pos" in map_item and map_item["pos"]:
            converted_item = convert_dspf_item(map_item)
            react_items.append(converted_item)
    return react_items


def combine_rsx_code(react_items, component_name, component_data):
    """
    Combines React component code into a complete React component file.

    Args:
    - react_items (list): List of React component codes.
    - component_name (str): Name of the React component.

    Returns:
    - str: Complete React component file code.
    """
    react_items = "".join(react_items)
    react_component = f"""
import {{ type ChangeEvent, useState, type KeyboardEvent }} from 'react';
import {{ Helmet }} from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import {{ GridItem }} from '../../components/GridSystem';
import Input from '../../components/Input';


export default function {component_name}() {{

{component_data}
  return (
    <>
    <Helmet>
        <title>{component_name}</title>
    </Helmet>
     {react_items}
    </>
  );
}}
    """
    return react_component


def parse_dspf_2_tsx(dspf_file, tsx_directory):
    """
    Parses a DSPF file and generates one React component per logical screen
    (record format) it contains.

    Args:
    - dspf_file (str): Path to the DSPF file.
    - tsx_directory (str): Directory the generated .tsx file(s) are written to.

    Returns:
    - list: Information (dict with "name") about each generated React component.
    """
    results = []
    try:
        base_name = os.path.splitext(os.path.basename(dspf_file))[0]
        blocks = split_by_record(dspf_file)
        multi = len(blocks) > 1
        for record_name, lines in blocks:
            component_name = (
                f"{base_name}_{record_name}" if multi and record_name else base_name
            )
            map_items = extract_map_items_from_lines(lines)
            react_items = convert_react_items(map_items)
            rsx_file_content = combine_rsx_code(
                react_items,
                component_name,
                extract_type_data(map_items, component_name),
            )
            tsx_file = os.path.join(tsx_directory, f"{component_name}.tsx")
            with codecs.open(tsx_file, "w", encoding="utf-8") as file:
                file.write(f"{rsx_file_content}")
            results.append({"name": component_name})
    except Exception as exception:
        print(exception)
        return []
    return results


def process_file_dspf(dspf_file, dspf_directory, react_directory):
    """
    Processes a DSPF file and generates React components.

    Args:
    - dspf_file (str): Path to the DSPF file.
    - dspf_directory (str): Path to the DSPF folder.
    - react_directory (str): Path to the React folder.

    Returns:
    - list: Information about the generated React component(s).
    """
    react_path = dspf_file.replace(f"{dspf_directory}", f"{react_directory}")
    tsx_directory = os.path.dirname(react_path)
    os.makedirs(tsx_directory, exist_ok=True)
    results = parse_dspf_2_tsx(dspf_file, tsx_directory)
    if not results:
        print(f"\033[91m{dspf_file}\033[0m")
    return results


def export_react_router(dfhmsd, tsx_directory):
    """
    Exports a React Router file based on the generated React components.

    Args:
    - dfhmsd (list): List of dictionaries containing React component information.
    - tsx_directory (str): Path to the directory containing React components.

    Returns:
    - bool: True if successful, False otherwise.
    """
    dfhmsd = [value for value in dfhmsd if value is not None]
    try:
        router_file = os.path.join(tsx_directory, "dspfRoutes.tsx")
        react_import = []
        react_export = []
        for item in dfhmsd:
            react_export.append({"name": item["name"], "component": f'{item["name"]}'})
            react_import.append(f'import {item["name"]} from "./{item["name"]}"')
        output_str = json.dumps(react_export, separators=(",", ":"))
        react_import = "\n".join(react_import)
        react_code = f"""
import {{ type ElementType }} from 'react';
{react_import}

type DFPSRoutes = {{
  name: string;
  component: ElementType;
}}[];

const dfpsRoutes: DFPSRoutes = {output_str};

export default dfpsRoutes;
"""
        react_code = re.sub(r'"component":"([^"]+)"', r"component:\1", react_code)
        react_code = re.sub(r'"name":"([^"]+)"', r'name:"\1"', react_code)
        with open(router_file, "w", encoding="utf8") as tsx_file:
            tsx_file.write(f"{react_code}")
    except Exception as ex:
        print(ex)
        return False
    return True


def export_react_router_from_dir(tsx_directory):
    """
    Exports React Router file from an existing directory of React components.

    Args:
    - tsx_directory (str): Path to the directory containing React components.

    Returns:
    - bool: True if successful, False otherwise.
    """
    tsx_files = [f for f in os.listdir(tsx_directory) if f.endswith(".tsx")]
    tsx_files = [
        f.replace(tsx_directory, "")
        .replace(".tsx", "")
        .replace("/", "")
        .replace("\\", "")
        for f in tsx_files
    ]
    tsx_files = [s for s in tsx_files if not any(c.islower() for c in s)]
    tsx_files = [{"name": f} for f in tsx_files]
    return export_react_router(tsx_files, tsx_directory)


def list_file_in_input_source(dspf_directory, react_directory):
    """
    Lists and processes all DSPF files in the specified directory.

    Args:
    - dspf_directory (str): Path to the DSPF folder.
    - react_directory (str): Path to the React folder.
    """
    dfhmsd_list = []
    if not os.path.exists(dspf_directory):
        print(f"\033[91mBMS directory '{dspf_directory}' does not exist.\033[0m")
        return
    if not os.path.exists(react_directory):
        os.makedirs(react_directory)
    dspf_files = []
    for root, dirs, files in os.walk(dspf_directory, followlinks=False):
        for file in files:
            if file.endswith(".dspf"):
                dspf_files.append(os.path.join(root, file))
    for dspf_file in dspf_files:
        dfhmsd_list.extend(
            process_file_dspf(dspf_file, dspf_directory, react_directory)
        )

    if export_react_router_from_dir(react_directory):
        print(f"\033[92mExported router name: dspfRouter.tsx\033[0m{''}")
    else:
        print(f"\033[91mUnable to export router name\033[0m{''}")


def main():
    """
    Main function to execute the DSPF to React conversion.
    """
    os.system("")
    parser = argparse.ArgumentParser(
        description="Process DSPF and React folders using dspf2react.py"
    )
    parser.add_argument("-dspf", help="Path to the DSPF folder", required=True)
    parser.add_argument("-react", help="Path to the React folder", required=True)
    args = parser.parse_args()
    dspf_directory = args.dspf
    react_folder = args.react
    list_file_in_input_source(dspf_directory, react_folder)


if __name__ == "__main__":
    main()
