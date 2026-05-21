/* eslint-disable react/prop-types */
import { HStack, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";


export default function SearchBar({ search, setSearch, setShow }) {

    const handleChanging = (e) => {
        setSearch(e.target.value)
        if (e.target.value.length === 0) {
            setShow(true)
        } else {
            setShow(false)
        }
    }

    return (
        <HStack mt="4rem" spacing={2} justify="center" bg="white" borderRadius="8px" p="0.5rem 1rem" textAlign="center" >
            <SearchIcon />
            <Input value={search} onChange={handleChanging} type="text" color="#000" placeholder="Search for exams by name or date..." _placeholder={{ color: "gray.600" }} size="lg" />
        </HStack>
    )
}
