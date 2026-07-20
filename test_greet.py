from greet import greet


def test_greet_with_name():
    assert greet("Ada") == "Hello, Ada!"


def test_greet_with_empty_name():
    assert greet("") == "Hello, stranger!"
