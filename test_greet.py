from greet import greet


def test_greet_with_name():
    assert greet("Ada") == "Hello, Ada!"
